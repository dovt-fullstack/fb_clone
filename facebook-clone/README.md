# facebook-clone

Building Facebook UI Clone using React & Tailwind CSS🔥

<img src="https://repository-images.githubusercontent.com/295202619/a69feb00-ce17-11eb-99c0-88a325f87bf9" alt="screenshot"/>

# Installation

```javascript
cd YOUR-PROJECT-FOLDER
yarn  // install all packages dependencies
yarn dev  // run app
```

# Contribution

Looking for contribution? Your contribution will be much appreciated. <3

Just send a PR with new changes.

Show some ❤️ by ⭐ the project.



<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Trang Web</title>
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }

    header {
        background-color: #333;
        color: #fff;
        padding: 10px 0;
        text-align: center;
    }

    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }

    .logo {
        flex-grow: 1;
        text-align: center;
    }

    .menu-btn {
        background-color: #333;
        color: #fff;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
    }

    .menu {
        display: none;
        flex-direction: column;
        background-color: #333;
        padding: 10px;
        position: absolute;
        top: 100%;
        right: 0;
    }

    .menu a {
        color: #fff;
        text-decoration: none;
        padding: 5px 0;
    }
</style>
</head>
<body>

<header>
    <div class="container">
        <div class="logo">
            <h1>Logo</h1>
        </div>
        <button class="menu-btn">Menu</button>
        <div class="menu">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
        </div>
    </div>
</header>

<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://via.placeholder.com/1200x400?text=Slide+1" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://via.placeholder.com/1200x400?text=Slide+2" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://via.placeholder.com/1200x400?text=Slide+3" class="d-block w-100" alt="...">
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
<script>
    $(document).ready(function(){
        $(".menu-btn").click(function(){
            $(".menu").slideToggle();
        });
    });
</script>

</body>
</html>
