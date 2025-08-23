from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console messages correctly
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        try:
            # 1. Navigate to the application's home page.
            page.goto("http://localhost:5173/", timeout=30000)

            # 2. Wait for the book list to be populated.
            bestsellers_heading = page.get_by_role("heading", name="BestSellers")
            expect(bestsellers_heading).to_be_visible(timeout=15000)

            swiper_container = bestsellers_heading.locator("xpath=//following-sibling::div[contains(@class, 'relative')]").first
            expect(swiper_container).to_be_visible(timeout=10000)

            first_book_image = swiper_container.locator("img").first
            expect(first_book_image).to_be_visible(timeout=10000)

            # 3. Take a screenshot.
            page.screenshot(path="jules-scratch/verification/verification.png", full_page=True)
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            # In case of error, take a screenshot for debugging.
            page.screenshot(path="jules-scratch/verification/error.png", full_page=True)

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
