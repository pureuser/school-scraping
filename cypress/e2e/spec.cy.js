describe('Scrape data with pagination from driving schools', () => {
  it('Scrapes all pages of data and writes to a file', () => {
    cy.visit('https://safedrivedlt.com/driving-school/')

    let allData = []

    const scrapePage = (currentPage) => {
      cy.log(`Scraping page ${currentPage}`)

      cy.get('.fc-item-box')
        .each(($el) => {
          const contentText = $el.find('.fc-item-content').text().trim()
          const contentParts = contentText.split('\n')

          let scrapedItem = {
            school_name: $el.find('.place_title').text().trim(),
            course: '',
            address: '',
            contact: '',
            facebook: $el
              .find('a[href^="https://www.facebook.com"]')
              .attr('href'),
            line: $el.find('a[href^="https://line.me"]').attr('href'),
            phone_link: $el.find('a[href^="tel:"]').attr('href'),
            google_maps: $el
              .find('a[href^="https://www.google.com/maps"]')
              .attr('href'),
          }

          contentParts.forEach((part) => {
            if (part.startsWith('หลักสูตรที่เปิดสอน :')) {
              scrapedItem.course = part
                .replace('หลักสูตรที่เปิดสอน :', '')
                .trim()
            } else if (part.startsWith('ที่ตั้ง :')) {
              scrapedItem.address = part.trim()
            } else if (part.startsWith('ติดต่อ :')) {
              scrapedItem.contact = part.trim()
            }
          })

          allData.push(scrapedItem)
        })
        .then(() => {
          cy.get('.location_pagination1.wpgmp_pagination a').then(($links) => {
            const nextPageLink = $links.filter(
              (i, el) => el.textContent.trim() === String(currentPage + 1)
            )
            if (nextPageLink.length > 0) {
              cy.wrap(nextPageLink).click()
              cy.wait(2000) // Wait for the page to load
              scrapePage(currentPage + 1)
            } else {
              finalizeScraping()
            }
          })
        })
    }

    const finalizeScraping = () => {
      cy.task('writeToFile', {
        filename: 'scraped_data.json',
        data: JSON.stringify(allData, null, 2),
      }).then((result) => {
        if (result === null) {
          cy.log(`Scraping complete. Total items scraped: ${allData.length}`)
        } else {
          cy.log(`Error writing to file: ${result}`)
        }
      })
    }

    scrapePage(1)
  })
})
