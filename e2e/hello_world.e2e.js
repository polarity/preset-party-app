import { expect } from "chai";
import testUtils from "./utils";

describe("application launch", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("shows 'Bitwig Preset Party' text on screen after launch", function() {
    return this.app.client.getText(".container h1").then(text => {
      expect(text).to.equal("Bitwig Preset Party");
    });
  });
});
