/****************** FILTRO *******************/
// Years
function loadYears(since, until) {
  if (since > until) {
    return;
  }
  const selectYear = document.querySelector("#yearSelector");
  for (let year = until; year >= since; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    selectYear.appendChild(option);
  }
}
loadYears(1900, 2023);

// Esto elimina todas las opciones de la lista excepto la primera. Sirve en caso que no se haya elegido nada antes.
function insertToSelector(selector, optionList) {
  let firstOption = selector.firstElementChild;
  selector.innerHTML = "";
  selector.appendChild(firstOption);
  for (const option of optionList) {
    const newOption = document.createElement("option");
    newOption.value = option;
    newOption.text = option;
    selector.appendChild(newOption);
  }
}

// Brands and models
function loadBrandsAndModels() {
  fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
    .then(function (res) {
      return res.json();
    })
    .then(function (brands) {
      const brandOptions = document.querySelector("#brandOption");
      const modelOptions = document.querySelector("#modelOption");
      insertToSelector(brandOptions, brands);
      brandOptions.addEventListener("change", (e) => {
        fetch(
          `https://ha-front-api-proyecto-final.vercel.app/models?brand=${e.target.value}`
        )
          .then((res) => res.json())
          .then((models) => {
            insertToSelector(modelOptions, models);
          });
      });
    })
    .catch(function (err) {
      console.error(err);
    });
}
loadBrandsAndModels();

// Boton de filtro
const filter = document.querySelector("#filter-btn");
filter.addEventListener("click", function (filter) {
  const year = document.querySelector("#yearSelector").value;
  const brand = document.querySelector("#brandOption").value;
  const model = document.querySelector("#modelOption").value;
  const state = document.querySelector("#stateOption").value;
  loadCars(
    `https://ha-front-api-proyecto-final.vercel.app/cars?year=${year}&brand=${brand}&model=${model}&state=${state}`
  );
});

/****************** CARS *******************/
function loadCars(apiURL) {
  fetch(apiURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (cars) {
      const carRow = document.querySelector("#car-row");
      carRow.innerHTML = "";
      const carsAlert = document.querySelector("#car-row");
      if (cars.length === 0) {
        carsAlert.insertAdjacentHTML(
          "beforeend",
          `<div class="alert alert-warning" role="alert">
            No se han encontrado resultados para tu búsqueda.
          </div>`
        );
      }
      for (const car of cars) {
        if (car.status) {
          car.isNew = `<span class="badge bg-warning position-absolute mt-3 mx-3">New</span>`;
        } else {
          car.isNew = "";
        }
        car.stars = ``;
        for (let i = 0; i < car.rating; i++) {
          car.stars += `<i class="text-warning bi bi-star-fill "></i>`;
        }
        for (let i = car.rating; i < 5; i++) {
          car.stars += `<i class=" text-warning bi bi-star"></i>`;
        }
        carRow.insertAdjacentHTML(
          "beforeend",
          `
          <!-- Picture -->
            <div class="col-12 col-lg-5 col-xl-4 pb-4">
              <div class="position-relative h-100">
                ${car.isNew}
                <img
                  class="img-fluid border p-1"
                  src="${car.image}"
                  alt="${car.brand} ${car.model}"
                />
              </div>
            </div>
            <!-- Info -->
            <div class="col-12 col-lg-7 col-xl-8 pb-4 car-card">
              <div>
                <div class="car-model-price">
                  <h3>${car.brand} ${car.model}</h3>
                  <p>
                    ${car.year} | USD ${car.price_usd} | ${car.stars}
                  </p>
                </div>
                <p class="car-info">
                  ${car.description}
                </p>
              </div>
              <div class="py-1">
                <button class="btn btn-success">
                  <i class="bi bi-cart"></i> Comprar
                </button>
                <button class="btn btn-light">
                  <i class="bi bi-plus-square"></i> Más información
                </button>
                <button class="btn btn-light">
                  <i class="bi bi-share"></i> Compartir
                </button>
              </div>
            </div>
         <hr>`
        );
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}
loadCars("https://ha-front-api-proyecto-final.vercel.app/cars");
