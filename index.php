<!DOCTYPE html>
<html>
<head>
    <title>PYTHAGORAS</title>
    <link rel="stylesheet" href="style.css"><meta name="viewport" content="width=device-width, initial-scale=1.0">


</head>
<body id="body">
<div id="Overlay">
    <div class="bigHeader">Interactive Proof of the Pythagoras Theorem!</div>
    <div class="subheading">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet</div>
    <div id="OverlayChildren">
    <div class="header">Pick your preferred Values(10-100):</div>
    <div class="valueSelect">
        <form method="get" action="shapes.php">
            <label for="a" >a: </label>
                <input type="number" name="a" id="a" min="5" max="30" required>
            <label for="b" >b: </label>
                <input type="number" name="b" id="b" min="5" max="30" required>
            <button type="submit" id="submitButt">Submit</button>
        </form>
    </div>
    </div>
</div>
<script src="InputCheck.js"></script>
</body>
</html>
