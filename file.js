document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://api.exchangerate-api.com/v4/latest"; // Example base URL
  
    const dropdowns = document.querySelectorAll(".dropdown select");
    const btn = document.querySelector("form button");
    const fromCurr = document.querySelector("#from");
    const toCurr = document.querySelector("#to");
    const msg = document.querySelector(".message");
  
    if (!msg) {
      console.error("Error: .message element not found in the DOM.");
      return; // Exit early if message element is not found
    }
  
    // Populate dropdowns with currency codes
    for (let select of dropdowns) {
      for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
          newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
          newOption.selected = "selected";
        }
        select.append(newOption);
      }
  
      select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
      });
    }
  
    const updateExchangeRate = async () => {
      let amount = document.querySelector("#amount");
      let amtVal = amount.value;
      if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
      }
  
      const fromCurrency = fromCurr.value;
      const toCurrency = toCurr.value;
  
      const URL = `${BASE_URL}/${fromCurrency}`;
  
      try {
        let response = await fetch(URL);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        let data = await response.json();
        let rate = data.rates[toCurrency];
  
        if (!rate) {
          throw new Error(`Exchange rate for ${toCurrency} not found.`);
        }
  
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
      } catch (error) {
        console.error('Fetch error:', error);
        msg.innerText = 'Error fetching exchange rate. Please try again later.';
      }
    };
  
    const updateFlag = (element) => {
      let currCode = element.value;
      let countryCode = countryList[currCode];
      let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
      let img = element.parentElement.querySelector("img");
      if (img) {
        img.src = newSrc;
      }
    };
  
    btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      updateExchangeRate();
    });
  
    window.addEventListener("load", () => {
      updateExchangeRate();
    });
  });
  