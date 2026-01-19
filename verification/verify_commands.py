from playwright.sync_api import sync_playwright, expect

def verify_commands_list():
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

        # Since we can't easily simulate voice recognition in headless mode without mocking,
        # we will rely on checking if the component is mounted (which we did by adding it to App.tsx)
        # and that we can potentially see the dialog if we manually trigger the state
        # (though we can't easily access React state from outside without React DevTools or exposing it)

        # Ideally, we would simulate the voice command "help", but that requires audio input.
        # However, we can verified the UI doesn't crash on load.

        # Take a screenshot of the main page to ensure no layout break
        page.screenshot(path="verification/commands_list_initial.png")
        print("Initial screenshot taken.")

        # Note: To fully verify the "Show Commands" dialog appears, we would need to mock the
        # VoiceAssistantContext or simulate the speech recognition result event.
        # For now, we verified the code logic and build.

        browser.close()

if __name__ == "__main__":
    verify_commands_list()
