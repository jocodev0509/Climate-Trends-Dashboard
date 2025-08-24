import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock axios
vi.mock("@/lib/axios", () => {
  const post = vi.fn();
  const api = { post };
  return {
    __esModule: true,
    default: api,
  };
});

// Partial mock for react-router-dom to mock useNavigate only
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuthStore as a hook
const mockLogin = vi.fn();

vi.mock("@/features/auth/store", () => ({
  useAuthStore: {
    getState: () => ({
      login: mockLogin
    })
  }
}));

import LoginForm from "../LoginForm";
import api from "@/lib/axios";
import { MemoryRouter } from "react-router-dom";

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  it("renders form fields and buttons", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeInTheDocument();
    });
  });

it("submits valid form and calls login + navigate", async () => {
  // Mock API response with full user object
  (api.post as any).mockResolvedValue({
    data: {
      token: "token",
      user: {
        id: 1,
        email: "test@test.com",
        role: "admin",
        username: "testuser"
      }
    }
  });

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  // Fill in the form
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  // Wait for login and navigation to be called
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith(
      { id: 1, email: "test@test.com", role: "admin", username: "testuser" },
      "token"
    );
    expect(mockNavigate).toHaveBeenCalled();
  });
});


  it("shows server error when API fails", async () => {
    (api.post as any).mockRejectedValue({ response: { data: { message: "Server Error" } } });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
