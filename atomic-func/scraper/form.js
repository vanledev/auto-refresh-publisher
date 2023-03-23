async function getLoginFieldName(res) {
  const usernameFieldName = await parseAndGetElementAttribute({
    res,
    querySelector: 'input[type="text"',
    attr: "name",
  });
  const passwordFieldName = await parseAndGetElementAttribute({
    res,
    querySelector: 'input[type="password"',
    attr: "name",
  });
  return { usernameFieldName, passwordFieldName };
}
function stripWrongHTMLEntities(str) {
  const regex = /&.*?;/g;

  const matches = str.match(regex);
  let uniqueItems = [...new Set(matches)];

  if (uniqueItems.length === 0) {
    return str;
  }
  for (let entity of uniqueItems) {
    const regex = new RegExp(`${entity}`, "g");

    str = str.replace(regex, decode(entity));
  }

  return str;
}

// const formFields = {
//   input: [
//     {
//       selector: 'input[name$="HoTen"]',
//       contentToInsert: "yourName",
//     },
//     {
//       selector: 'input[name$="TieuDe"]',
//       contentToInsert: "title",
//     },
//   ],
//   iframeInput: [
//     {
//       frameName: "designEditor",
//       selector: "body",
//       contentToInsert: "content",
//     },
//   ],

//   submitButton: "[id$=htmlModeTab]",
// };

async function sendForm({ page, formFields }) {
  const fields = formFields;
  try {
    for (let input of fields.input) {
      await page.$eval(
        input.selector,
        (el, contentToInsert) => {
          el.value = contentToInsert;
        },
        input.contentToInsert
      );
    }
    if (fields.buttons) {
      for (let button of fields.buttons) {
        const selector = await page.waitForSelector(button);
        await selector.click();
      }
    }

    if (fields.iframeInput) {
      for (let input of fields.iframeInput) {
        const myFrame = page
          .frames()
          .find((frame) => frame.name().includes(input.frameName));

        await myFrame.$eval(
          input.selector,
          (el, contentToInsert) => {
            el.innerHTML = contentToInsert;
          },
          input.contentToInsert
        );
      }
    }

    const submitButton = await page.waitForSelector(fields.submitButton);
    await submitButton.click();
    return page;
  } catch (e) {
    console.log(e);
  }
}

const formFn = { sendForm };

export default formFn;
