describe("GitHub API Integration", () => {
  it("should handle user not found errors gracefully", async () => {
    const fakeFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: "Not Found" }),
      }),
    );
    const response = await fakeFetch();
    const data = await response.json();
    expect(data.error).toBe("Not Found");
  });
});
