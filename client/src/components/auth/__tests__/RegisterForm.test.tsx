import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("@/lib/axios", () => {
  const post = vi.fn();
  return { __esModule: true, default: { post } };
});
import api from "@/lib/axios";

// Mock react-router-dom (useNavigate)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuthStore
const mockRegister = vi.fn();
vi.mock("@/features/auth/store", () => ({
  useAuthStore: {
    getState: () => ({
      register: mockRegister
    })
  }
}));

import RegisterForm from "../RegisterForm";

// Clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("RegisterForm", () => {
  it("renders form fields and social buttons", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();

    // Social buttons
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeInTheDocument();
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });
  });

    it("submits valid form and navigates", async () => {
  // Mock successful API response
  (api.post as any).mockResolvedValue({
    data: { message: "User registered successfully" },
  });

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

  // Submit form
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  // Wait for API call and navigation
  await waitFor(() => {
    // Check API called with correct data
    expect(api.post).toHaveBeenCalledWith("/auth/register", {
      username: "testuser",
      email: "test@test.com",
      password: "password123",
    });

    // Check navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith("/"); 
  });
});


  it("shows server error when API fails", async () => {
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

  // Submit form
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
