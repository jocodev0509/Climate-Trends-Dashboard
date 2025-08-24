import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import RegisterForm from "../RegisterForm";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => {
  const post = vi.fn();
  return { __esModule: true, default: { post } };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Optional: mock auth store if you track register/login
const mockRegister = vi.fn();
vi.mock("@/features/auth/store", () => ({
  useAuthStore: {
    getState: () => ({
      register: mockRegister,
    }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RegisterForm Integration", () => {
  it("register flow: submits form, calls API, and navigates on success", async () => {
    (api.post as any).mockResolvedValue({ data: { message: "User registered successfully" } });

    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait for API call and navigation
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        username: "testuser",
        email: "test@test.com",
        password: "password123",
      });

      expect(mockNavigate).toHaveBeenCalledWith("/"); // redirect to login page
    });
  });

  it("shows validation errors for invalid inputs", async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    // Fill inputs with invalid values
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "321" } }); // mismatched

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("handles server error on registration failure", async () => {
    (api.post as any).mockRejectedValue({ response: { data: { message: "Server Error" } } });

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
