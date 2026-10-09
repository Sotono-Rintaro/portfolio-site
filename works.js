fetch("works.csv")
    .then(function(response){
        return response.text();
    })
    .then(function(data){

        //CSVを行ごとに分割
        var rows=data.trim().split("\n");

        //一行目は見出し
        var headers=rows[0].split(",");

        //二行目以降を作品データにする
        var works=rows.slice(1).map(function(row){

            var values=row.split(",");

            var work={};

            headers.forEach(function(header,index){
                work[header]=values[index];
            });

            return work;
        });
        //Worksを表示する場所
        var grid=document.getElementById("works-grid");
        var categorySelect=document.getElementById("category");
        var sortSelect=document.getElementById("sort");

        //カテゴリ一覧を作る
        var categories=[];

        works.forEach(function(work){
            //まだ追加されていないカテゴリならリストに追加  
            if(!categories.includes(work.category)){
                categories.push(work.category);
            }
        });
        //selectにカテゴリを追加しwebページに表示させる
        categories.forEach(function(category){
            var option=document.createElement("option");
            option.value=category;
            option.textContent=category;
            categorySelect.appendChild(option);
        });
        //作品を表示する関数

function displayWorks() {
    // 選択されたカテゴリとソート方法を取得
    var selectedCategory = categorySelect.value;
    var sortType = sortSelect.value;

    // 元の作品データをコピー
    var filteredWorks = works.slice();

    // カテゴリの絞り込み
    if (selectedCategory !== "all") {
        filteredWorks = filteredWorks.filter(function(work) {
             return work.category === selectedCategory;
        });
    }

    // ソート
    if (sortType === "new") {
        filteredWorks.sort(function(a, b) {
            return Number(b.year) - Number(a.year);
        });
    } else if (sortType === "old") {
        filteredWorks.sort(function(a, b) {
            return Number(a.year) - Number(b.year);
        });
    } else if (sortType === "title") {
        filteredWorks.sort(function(a, b) {
            return a.title.localeCompare(b.title, "ja");
        });
    }

    // 以前の作品カードを消す
    grid.innerHTML = "";

    // 作品カードを１つずつ作成
    filteredWorks.forEach(function(work) {
        var card = document.createElement("article");
        card.className = "work-card";

        card.innerHTML =
            '<a href="' + work.link + '">' +
                '<img src="' + work.image + '" alt="' + work.title + '">' +
                '<div class="work-info">' +
                    '<p class="work-category">' + work.category + '</p>' +
                    '<h4>' + work.title + '</h4>' +
                    '<p>' + work.description + '</p>' +
                    '<p class="work-year">' + work.year + '</p>' +
                '</div>' +
            '</a>';

        grid.appendChild(card);
    });
}

        displayWorks();
        categorySelect.addEventListener("change",function(){
            displayWorks();
        });

        sortSelect.addEventListener("change",function(){
            displayWorks();
        });

    })