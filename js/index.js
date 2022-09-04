// apis
const GET_NEWS_CATEGORIES = "https://openapi.programming-hero.com/api/news/categories";
const GET_ALL_NEWS = "https://openapi.programming-hero.com/api/news/category";
const GET_SINGLE_NEWS = "https://openapi.programming-hero.com/api/news";
const DEFAULT_CATEGORY_ID = "08";
const DEFAULT_CATEGORY_NAME = "All News";

var counter = 0;
var selectedCategory = "";

// Utility functions
//////////////////////////////////////////////////////////////
// Generate sliced text
const generateSlicedText = (text, minlimit, maxlimit) => {
  return text.slice(minlimit, maxlimit);
}

// Fetch data from api and handle exception
const getValidResponse = async(url) => {
  const data = await fetch(url)
  .then((response) => response.json())
  .catch(error => { throw new Error(`An error has occured: ${error}`)})
  return data.data;
}

// Toggle spinner
const toggleSpinner = (isLoading) => {
  const loaderSection = document.getElementById('spinner-loader');
  if(isLoading) {
    loaderSection.innerHTML = `<div class="flex justify-center items-center h-screen fixed top-0 left-0 right-0 bottom-0 w-full z-50 overflow-hidden bg-gray-700 opacity-75">
    <div class="spinner-border animate-spin inline-block w-8 h-8 rounded-full" role="status">
  <span class="visually-hidden">
      <svg
        className="animate-spin -inline-block w-8 h-8 border-4 rounded-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
  </span>
    </div>
  </div>
    `;
    loaderSection.classList.remove('d-none');
  } else {
    loaderSection.classList.add('d-none');
  }
  
}
//////////////////////////////////////////////////////////////////////

// Entry point of the application
const startApp = () => {
  // Fetch all categories and show under nav bar
  getAllNewsCategories();
  // Show news on the first time load where no category id is provided
  displayDefaultNews();
};

// display defualt news
const displayDefaultNews = () => {
  if (counter == 0) {
    getAllMostViewedNewsByCategoryId(DEFAULT_CATEGORY_ID, DEFAULT_CATEGORY_NAME, true);
  }
};

// display view count
const displayItemFound = (categoryName, numOfNews) => {
  const itemFoundDiv = document.getElementById("item-found");
  itemFoundDiv.textContent = "";
  const paragraphEl = document.createElement("p");
  paragraphEl.innerText = `${numOfNews} items found for category ${categoryName}`;
  itemFoundDiv.appendChild(paragraphEl);
};



// News categories
const getAllNewsCategories = async () => {
  const data = await getValidResponse(GET_NEWS_CATEGORIES);
  displayAllCategories(data["news_category"]);
};

const displayAllCategories = (categories) => {
  const allCategoriesDiv = document.getElementById("allCategories");
  categories.forEach((category) => {
    const singleCategoryDiv = document.createElement("div");

    const singleButtonEl = document.createElement("button");
    singleButtonEl.setAttribute("id", category.category_id);
    singleButtonEl.setAttribute(
      "onclick",
      `getAllMostViewedNewsByCategoryId('${category.category_id}', '${category.category_name}', 'false')`
    );
    singleButtonEl.innerHTML = category.category_name;

    singleCategoryDiv.appendChild(singleButtonEl);
    allCategoriesDiv.appendChild(singleCategoryDiv);
  });
  // allCategoriesDiv.appendChild(ulListContent);
};

// All news by id
const getAllMostViewedNewsByCategoryId= async (
  categoryId,
  categoryName,
  isFirstTimeLoad
) => {
  const allNews = await getValidResponse(`${GET_ALL_NEWS}/${categoryId}`);
  // The most viewed news at the top
  allNews.sort((n1, n2) => (n1.total_view < n2.total_view) ? 1 : -1);
  if (isFirstTimeLoad != true) {
    counter = allNews.length;
    displayItemFound(categoryName, counter);
  } else {
    displayNewsDetails(allNews);
  }
  
};

const displayNewsDetails = (allNews) => {
  // todo: Make the cards prettier
  const newsDetailsContainer = document.getElementById(
    "news-details-container"
  );
  newsDetailsContainer.textContent = "";
  allNews.forEach((news) => {
    const newsDetailsContainerDiv = document.createElement("div");
    const newsDetails = generateSlicedText(news.details, 0, 200);
    // todo: Beautify using css
    newsDetailsContainerDiv.innerHTML = `
        <div class="card card-compact w-80 bg-base-60 shadow-xl ">
              <figure><img src="${news.image_url}" alt="News" /></figure>
              <div class="card-body">
                <h2 class="card-title">${news.title}</h2>
                <p>${newsDetails}</p>
                <div class="card-actions justify-end">
                <p>View count: ${news.total_view}</p>
                <button class="btn btn-primary" onclick="displaySingleNewsInModal('${news._id}')">Details</button>
                </div>
              </div>
              <div class="container mb-4">
              <img src="${news.author.img}" class="w-14 rounded-full items-center" />
              <p>${news.author.name}</p>
              </div>
            </div>
        `;
    newsDetailsContainer.appendChild(newsDetailsContainerDiv);
  });
};

// Single news
// todo: Optimize by keeping the urls in const var at the head.
const getSingleNewsByNewsId = async (newsId) => {
  const res = await fetch(`${GET_SINGLE_NEWS}/${newsId}`);
  const data = await res.json();
  return data.data[0];
};

// Display news inside modal
const displaySingleNewsInModal = (newsId) => {
getSingleNewsByNewsId(newsId).then(news => {
  const newsModalEl = document.getElementById('news-modal-box');
  newsModalEl.innerHTML = `
  <div class="modal-box">
  <h3 class="font-bold text-lg">${news.title}</h3>
  <img src="${news.image_url}" />
  <div class="modal-action">
    <label for="news-modal" class="btn">OK</label>
  </div>
  </div>
  `
  // Open modal
  document.getElementById('news-modal').checked = true;
  });
 
}


// Start the application
startApp();


