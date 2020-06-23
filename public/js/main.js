/***
* Client side logic to add pagination links and display certain amount of books per page
***/
(() => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const items_per_page = 10;

    let inputValue = "";
    searchForm.addEventListener("submit", (event) => {
        inputValue = searchInput.value;
    });

    /***
    * `paginationCallback` function
    * @param {Object} e - holds the value of the event object
    * removes the active class from all the anchor tags.
    * later adds the active class to the element who triggered the event.
    * calls the showPage function to display books based on the page selected
    ***/
    function paginationCallback(e) {
        e.preventDefault();
        const anchors = document.querySelectorAll("[data-pagination]");
        for(let i = 0, len = anchors.length; i < len; i++){
            anchors[i].classList.remove("active");
        }

        e.target.classList.add("active");
        showPage(e.target.textContent);
    }

    /***
    * `showPage` function
    * @param {Number} page - holds the index of the current page
    * Display (items_per_page) number of books on the page
    ***/
    function showPage(page) {
        const start_index = (page * items_per_page) - items_per_page;
        const end_index = page * items_per_page;
        const list = document.querySelector("tbody").children;
        for (let i = 0, len = list.length; i < len ; i++){
            if(i >= start_index && i < end_index){
                list[i].style.display = "";
            } else {
                list[i].style.display = "none";
            }
        } // endFor
    }

    /***
    * `appendPageLinks` function
    * Create and append the pagination links to the main container
    ***/
    function appendPageLinks() {
        const mainContainer = document.querySelector(".main-container-js");
        const divPagination = document.createElement('DIV');
        divPagination.classList.add("pagination");
        const list = document.querySelector("tbody").children;
        divPagination.addEventListener("click", (e) => {
            paginationCallback(e, list);
        });

        for (let h = 0, len = list.length/items_per_page; h < len; h++ ) {
            const a = document.createElement("A");
            a.textContent = h + 1;
            a.href= `/page/${h + 1}`;
            a.dataset.pagination = "paginationLinks";
            if(h === 0) {
                a.classList.add("active");
            }
            divPagination.appendChild(a);
        }

        mainContainer.appendChild(divPagination);
    }

    /***
    * If the page contains a table (table of books in this case), call the function to create pagination links 
    * and display the required number of books per page.
    ***/
    if(document.querySelector("tbody")){
        appendPageLinks();
        showPage(1);
    }
})();