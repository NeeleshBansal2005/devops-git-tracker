const { Builder, By, Key, until } = require("selenium-webdriver");

describe("GitContributionTracker E2E Suite", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it("should load the dashboard and accept a username search", async () => {
    await driver.get("http://localhost:8080");
    const searchBox = await driver.findElement(By.id("username"));
    await searchBox.sendKeys("torvalds", Key.RETURN);

    await driver.wait(until.elementLocated(By.id("dashboard-content")), 5000);
    const name = await driver.findElement(By.id("name")).getText();
    expect(name).not.toBe("");
  });
});
