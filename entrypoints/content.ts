export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Nodoff content script loaded");
  },
});
