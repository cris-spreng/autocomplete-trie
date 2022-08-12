module.exports.capitalize = function(word){
    char = word.charAt(0).toUpperCase();
    res = char;
    for(let i=1;i<=word.length;i++){
        if(char == ' '){
            char = word.charAt(i).toUpperCase();
        }else{
            char = word.charAt(i);
        }
        res += char;
    }
    return res;
}