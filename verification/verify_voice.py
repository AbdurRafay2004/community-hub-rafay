from playwright.sync_api import Page, expect, sync_playwright
import os

def test_voice_assistant(page: Page):
    print("Navigating...")
    page.goto("http://localhost:8081/")
    page.wait_for_timeout(2000)

    print("Clicking button...")
    btn = page.get_by_label("Activate Voice Assistant")
    expect(btn).to_be_visible()
    btn.click()

    print("Verifying dialog...")
    expect(page.get_by_text("Voice Assistant").first).to_be_visible()

    page.wait_for_timeout(1000)
    print("Taking screenshot 1...")
    page.screenshot(path="verification/voice_assistant_dialog.png")

    print("Closing dialog...")
    page.keyboard.press("Escape")
    page.wait_for_timeout(500)

    print("Double clicking...")
    page.mouse.dblclick(100, 100)

    print("Verifying dialog again...")
    expect(page.get_by_text("Voice Assistant").first).to_be_visible()

    page.wait_for_timeout(1000)
    print("Taking screenshot 2...")
    page.screenshot(path="verification/voice_assistant_dblclick.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_voice_assistant(page)
            print("Test passed!")
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
