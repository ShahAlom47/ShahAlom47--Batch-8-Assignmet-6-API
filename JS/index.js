
let BtnContainer = document.getElementById('btn-container')
const errorContainer = document.getElementById('error-continer');
const cardContainer = document.getElementById('card-container');
const sortBtn = document.getElementById('sort-Btn');

let selectedCategory = 1000;
let isLoaded = true;
let sorted = false


// sorted button 
sortBtn.addEventListener('click', () => {
    sorted = true
    categoryCardId(selectedCategory, sorted);
})


// Loading(isLoaded);
const categorisBtn = async () => {

    const cateURL = ('https://openapi.programming-hero.com/api/videos/categories')
    const res = await fetch(cateURL);
    const dataObj = await res.json();
    let datas = dataObj.data

    for (let data of datas) {
        const newBtn = document.createElement('button');
        newBtn.classList = `active  cat-btn  rounded-md px-2 lg:px-3 py-1 lg:font-semibold hover:bg-slate-400 active:text-lg`
        
        newBtn.addEventListener('click', (e) => {
            categoryCardId(data.category_id)
            activeBtn(newBtn);
            isLoaded = false
            Loading(isLoaded);
        })

        newBtn.innerText = data.category;
        BtnContainer.appendChild(newBtn);

        if (newBtn.innerText === 'All') {

            newBtn.classList.add('bg-red-500');
            console.log(newBtn.innerText);
        }
    }
}
categorisBtn();


const categoryCardId = (id, sorted) => {
    selectedCategory = id;

    cardContainer.innerHTML = '';

    const cateURL = (`https://openapi.programming-hero.com/api/videos/category/${id}`)
    fetch(cateURL)
        .then((res) => res.json())
        .then(dataObj => {
            let datas = dataObj.data;

            if (sorted) {
                datas.sort((a, b) => {
                    let view1st = a.others?.views;
                    let view2nd = b.others?.views;

                    const view1stNum = parseFloat(view1st.replace('K', '')) || 0;
                    const view2ndNum = parseFloat(view2nd.replace('K', '')) || 0;

                    return view2ndNum - view1stNum;
                })
            }
// error show 
            if (datas.length === 0) {
                errorContainer.classList.remove('hidden')
                isLoaded = true
                Loading(isLoaded);
            }
            else {
                errorContainer.classList.add('hidden')
            }
// make video card 
            for (let data of datas) {
                makeCard(data, cardContainer)
            }
        })
    isLoaded = true
}


// active btn bg-red 
const activeBtn = (newBtn) => {

    let btns = document.querySelectorAll(".active");
    for (let btn of btns) {
        btn.classList.remove('bg-red-500')
    }
    newBtn.classList.add('bg-red-500');
}


const makeCard = (CardData, cardContainer) => {
    let Verifidebadg = '';
    if (CardData.authors[0].verified) {
        Verifidebadg = ` <img  class="w-5 h-5 " src="image/Group 3.svg" alt=""></img>`
    }

    const vCArd = document.createElement('div');
      vCArd.classList = ` card card-compact  bg-base-100 shadow-xl `
     vCArd.innerHTML = `
     <figure class='h-3/6' ><img class = " w-full h-full overflow-hidden " src=${CardData.thumbnail} alt="Shoes" /></figure>
     <div class="card-body ">
        <div class="heading flex gap-2">
        <img  class="w-5 h-5 rounded-full" src=${CardData?.authors[0]?.profile_picture} alt="">
            <h2 class="card-title  text-base ">${CardData.title}</h2>
        </div>
         <div class="flex gap-3  justify-start">
        <p class=" text-gray-500 font-semibold  flex-grow-0">${CardData?.authors[0]?.profile_name}</p>
        ${Verifidebadg}
         </div>
        <p class="text-gray-500"><span>${CardData.others.views}</span> View</p>
    </div>
    `
    cardContainer.appendChild(vCArd);

    isLoaded = true
    Loading(isLoaded);
}

// Loading ....

const Loading = (isLoaded) => {
    const loadingContainer = document.getElementById('Loading')

    if (isLoaded) {
        loadingContainer.classList.add('hidden')
    }
    else {
        loadingContainer.classList.remove('hidden')
    }
}

isLoaded = false
Loading(isLoaded);


categoryCardId(selectedCategory, sorted);



