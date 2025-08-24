// loginform.integration.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import LoginForm from "../LoginForm";
import api from "@/lib/axios";

// Mock axios
vi.mock("@/lib/axios", () => {
  const post = vi.fn();
  return { __esModule: true, default: { post } };
});

// Mock react-router-dom (useNavigate)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth store
const mockLogin = vi.fn();
vi.mock("@/features/auth/store", () => ({
  useAuthStore: {
    getState: () => ({
      login: mockLogin,
    }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm Integration", () => {
  it("renders form fields and social buttons", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();

    // Social buttons
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty/invalid inputs", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("submits valid form, calls API, updates auth state, and navigates", async () => {
    // Mock API response
    (api.post as any).mockResolvedValue({
      data: {
        user: { id: 1, email: "test@test.com", username: "testuser", role: "user" },
        token: "token123",
      },
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "password123",
      });

      expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, email: "test@test.com", username: "testuser", role: "user" },
        "token123"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard"); // assuming dashboard is the route after login
    });
  });

  it("shows server error when API fails", async () => {
    (api.post as any).mockRejectedValue({ response: { data: { message: "Invalid credentials" } } });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
