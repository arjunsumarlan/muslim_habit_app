import colors from "../../assets/constants/colors";

var COLORS = [];
while (COLORS.length < 100) {
    COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
}

function rand(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

export default color = COLORS