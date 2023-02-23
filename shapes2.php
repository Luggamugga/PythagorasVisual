<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <script src="https://unpkg.com/konva@8/konva.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div id="keyContainer">
    <table>
        <tr>
            <th>Color:</th>
            <th>Sidelength(s):</th>
        </tr>
        <tr>
            <td style="background-color:lightblue"></td>
            <td><span id="triSidelengths">a</span></td>
        </tr>
        <tr>
            <td style="background-color:#89a1c4 "></td><td>C</td>
        </tr>
    </table>
</div>
<div id="textBox">
    <div id="textContainer">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
        et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
    </div>
    <div id="buttonsContainer">
        <div id="hintButtContainer">
            <button id="hint">Get Hint</button>
        </div>

        <div id="nextButtContainer">
            <button type="button" id="nextButt"><a href="explain.php">Explanation</a></button>
        </div>
    </div>
</div>

<div id="draw"></div>


<script src="shapesApp.js"></script>

</body>

</html>