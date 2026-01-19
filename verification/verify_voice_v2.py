from playwright.sync_api import sync_playwright, expect

def verify_voice_assistant_upgrade():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        page.goto("http://localhost:8080/")

        # Handle potential alerts about speech recognition support
        page.on("dialog", lambda dialog: dialog.accept())

        # Wait for the voice assistant button to be visible
        voice_button = page.get_by_role("button", name="Start Voice Assistant")
        expect(voice_button).to_be_visible(timeout=10000)

        # Take a screenshot of the initial state
        page.screenshot(path="verification/voice_v2_initial.png")
        print("Initial screenshot taken.")

        # Test double-click activation
        page.mouse.dblclick(100, 100)

        # Wait a bit for state update
        page.wait_for_timeout(1000)

        # Check if it started listening (button should change state/title)
        # Note: In headless, speech recognition might fail instantly or trigger error state
        # But we can check if the button attempted to change

        # We can also check if the button itself responds to click as before
        voice_button.click()
        page.wait_for_timeout(500)

        # Take another screenshot
        page.screenshot(path="verification/voice_v2_active.png")
        print("Active screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_voice_assistant_upgrade()
