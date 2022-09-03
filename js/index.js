// apis
const GET_NEWS_CATEGORIES = "https://openapi.programming-hero.com/api/news/categories";
const GET_ALL_NEWS = "https://openapi.programming-hero.com/api/news/category";
const GET_SINGLE_NEWS = "https://openapi.programming-hero.com/api/news";
const DEFAULT_CATEGORY_ID = "01";
const DEFAULT_CATEGORY_NAME = "Breaking News";

var counter = 0;
var selectedCategory = "";

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
    getAllNewsByCategoryId(DEFAULT_CATEGORY_ID, DEFAULT_CATEGORY_NAME, true);
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
  const res = await fetch(GET_NEWS_CATEGORIES);
  const data = await res.json();
  displayAllCategories(data.data["news_category"]);
};

const displayAllCategories = (categories) => {
  const allCategoriesDiv = document.getElementById("allCategories");
  categories.forEach((category) => {
    const singleCategoryDiv = document.createElement("div");

    const singleButtonEl = document.createElement("button");
    singleButtonEl.setAttribute("id", category.category_id);
    singleButtonEl.setAttribute(
      "onclick",
      `getAllNewsByCategoryId('${category.category_id}', '${category.category_name}', 'false')`
    );
    singleButtonEl.innerHTML = category.category_name;

    // console.log(singleButtonEl)
    singleCategoryDiv.appendChild(singleButtonEl);
    allCategoriesDiv.appendChild(singleCategoryDiv);
  });
  // allCategoriesDiv.appendChild(ulListContent);
};

// All news by id
const getAllNewsByCategoryId = async (
  categoryId,
  categoryName,
  isFirstTimeLoad
) => {
  const res = await fetch(`${GET_ALL_NEWS}/${categoryId}`);
  const data = await res.json();
  const allNews = data.data;
  if (isFirstTimeLoad != true) {
    counter = allNews.length;
    displayItemFound(categoryName, counter);
  }
  displayNewsDetails(allNews);
};

const displayNewsDetails = (allNews) => {
  // todo: Make the cards prettier
  const newsDetailsContainer = document.getElementById(
    "news-details-container"
  );
  newsDetailsContainer.textContent = "";
  allNews.forEach((news) => {
    const newsDetailsContainerDiv = document.createElement("div");
    // todo: Beautify using css
    newsDetailsContainerDiv.innerHTML = `
        <div class="card card-compact w-96 bg-base-100 shadow-xl ">
              <figure><img src="${news.image_url}" alt="News" /></figure>
              <div class="card-body">
                <h2 class="card-title">${news.title}</h2>
                <p>"${news.details}"</p>
                <div class="card-actions justify-end">
                <button class="btn btn-primary">Details</button>
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
  document.getElementById('my-modal').checked = true;
};

// Single news
// todo: Optimize by keeping the urls in const var at the head.
const getSingleNewsByNewsId = async (newsId) => {
  const res = await fetch(`${GET_SINGLE_NEWS}/${newsId}`);
  const data = await res.json();
  displaySingleNews(data.data);
};

// todo: make html elements

const displaySingleNews = (news) => {
  


  console.log(news);
};

// getAllNewsCategories(
//   `https://openapi.programming-hero.com/api/news/categories`
// );
// getAllNewsCategories();
getSingleNewsByNewsId("0282e0e58a5c404fbd15261f11c2ab6a");

startApp();
