(() => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const items_per_page = 10;

    let inputValue = "";
    searchForm.addEventListener("submit", (event) => {
        console.log(searchInput.value);
        inputValue = searchInput.value;
    });

    /***
    * `paginationCallback` function
    * @param {Object} e - holds the value of the event object
    * @param {NodeList, Array} - holds a list of students to pass to showPage when a link is clicked along with the page number
    * removes the active class from all the anchor tags.
    * later adds the active class to the element who triggered the event.
    * calls the showPage function to display students based on the page selected
    ***/
    function paginationCallback(e, list) {
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
    * @param {NodeList} list - holds the list of all students, if it is empty display message to user
    * @param {Number} page - holds the index of the current page
    * Display (items_per_page) number of students on the page
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
    * @param {NodeList} list - holds the list of the students to calculate how many links (pages) are going to be needed
    * Calls createElem function. With the elements returned, append them to the page
    ***/
    function appendPageLinks() {
        const body = document.getElementsByTagName("body")[0];
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

        body.appendChild(divPagination);
    }

    appendPageLinks();
    // paginationCount();
    showPage(1);
    

})();