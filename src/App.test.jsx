import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App component", () => {
  it("renders the heading", () => {
    render(<App />);
    // Adjust the text to match something visible in your App.jsx
    expect(screen.getByText(/Cricket Auction/i)).toBeInTheDocument();
  });
});
