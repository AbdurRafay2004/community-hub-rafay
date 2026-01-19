from playwright.sync_api import sync_playwright, expect

def verify_voice_assistant():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        page.goto("http://localhost:8080/")

        # Wait for the voice assistant button to be visible
        # It has a title "Start Voice Assistant" or "Stop Voice Assistant"
        voice_button = page.get_by_role("button", name="Start Voice Assistant")
        expect(voice_button).to_be_visible(timeout=10000)

        # Take a screenshot of the initial state
        page.screenshot(path="verification/voice_assistant_initial.png")
        print("Initial screenshot taken.")

        # Click the button to start listening
        voice_button.click()

        # Wait for the state to change (it should pulsate or change color/icon)
        # The title changes to "Stop Voice Assistant"
        stop_button = page.get_by_role("button", name="Stop Voice Assistant")
        expect(stop_button).to_be_visible()

        # Also check for feedback bubble if possible, but it depends on speech recognition starting
        # Since we are in headless mode/environment without mic, speech recognition might error out immediately
        # or not start. However, the UI state should update if we clicked it.
        # Note: In some headless environments, SpeechRecognition is not supported,
        # so our code might alert "Speech recognition is not supported".
        # We should handle dialogs.

        page.on("dialog", lambda dialog: dialog.accept())

        # Take another screenshot
        page.screenshot(path="verification/voice_assistant_active.png")
        print("Active screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_voice_assistant()
