from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the local development server
        page.goto("http://localhost:5173", timeout=60000)

        # Wait for the main heading to be visible
        heading = page.locator('h1:has-text("Invoice Scanner")')
        expect(heading).to_be_visible(timeout=30000)

        # Check for the dropzone element
        dropzone_text = page.locator('p:has-text("Drag & drop images here, or click to select files")')
        expect(dropzone_text).to_be_visible()

        # Take a screenshot of the initial state
        page.screenshot(path="jules-scratch/verification/initial_view.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)