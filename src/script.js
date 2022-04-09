/*=====================

    ZhengLinLei - 2022/04/13

    Apache2.0 - Javascript

    Encrypt Charcode & Num v2

======================*/

class OwnCharList{
    /* ============

    Create your own charcode list
    
    To get the example template call the method OwnCharList.help()

    ============== */

    constructor(type){
        /* ===========
        type: ['utf-7', 'utf-8', 'utf-16', 'utf-32', 'own']

        Default: 'utf-7'
        ============= */
        // INIT THE DEFAULT CHAR CODE LIST

        if(['utf-7', 'utf-8', 'utf-16', 'utf-32', 'own'].includes(type)){
            this.type = type;
        }else{
            // Error type
            this.errorPrint(`Error type, only ["utf-7", "utf-8", "utf-16", "utf-32", "own"] parameters are allowed: <OwnCharList()> Element: ${type} \n\nMore info please read https://github.com/ZhengLinLei/encrypt-charcode-num-v2`);
        }
    }

    /* ===============
    Inner method
    ================ */
    errorPrint(s){
        var printStr;
        if(console.warn){
            printStr = console.error;
        }else{
            printStr = console.log;
        }

        printStr(s);
    }

    // ==============
    createList(array){
        // When the client import a CharList the type must be turned into 'own'
        this.type = 'own';

        // ===========
        let toFindDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
        let repetead = toFindDuplicates(array);

        if (!repetead.length){
            this.charList = array;
        }else{
            this.errorPrint(`There are repeated characters in the list: <OwnCharList.createList(array)> Elements: ${repetead} \n\nMore info please read https://github.com/ZhengLinLei/encrypt-charcode-num-v2`);
        }
    }

    help(){
        var printStr;
        if(console.warn){
            printStr = console.warn;
        }else{
            printStr = console.log;
        }

        printStr('Prepare an array with your Alphabet list like ["A", "b", "@", "z", ...] and import it into OwnCharList.createList(array) \n\nMore info please read https://github.com/ZhengLinLei/encrypt-charcode-num-v2');
    }
}

class KeyStr{
    // Default
    charList = {
        type: "utf-7",
        range: Math.pow(2, 7),
        list: []
    }
    // =======================
    constructor(key, str){ // str PARAMETER IT'S USED FOR SPLIT THE TEXT
        // INIT THE KEY
        this.changeKey(key, str);
    }

    /* ===============
    Inner module code
    ================ */
    strToArr(key, str = ','){
        // GENERATE AN ARRAY FROM STRING 
        let arr = key.split(str);

        // CHANGE THE VALUE TO INT
        arr = arr.map(el => parseInt(el));

        //
        return arr;
    }

    errorPrint(s){
        var printStr;
        if(console.warn){
            printStr = console.error;
        }else{
            printStr = console.log;
        }

        printStr(s);
    }

    /* ===============
    Prepare your own charcode list

    Default: utf-7
    ================ */
    importCharList(objectList){
        if(typeof objectList == 'object'){
            this.charList.type = objectList.type;
            this.charList.range = this.charList.type == 'own' ? objectList.charList.length : Math.pow(2, parseInt(this.charList.type.split('-').pop()));

            // Alphabet
            this.charList.list = objectList.charList;

        }else{
            this.errorPrint('Please import an existant object with <OwnCharList()> \n\nMore info please read https://github.com/ZhengLinLei/encrypt-charcode-num-v2')
        }
    }

    // ==============================

    changeKey(key, str){
        // CHANGE THE REAL KEY
        this.key = this.strToArr(key, str);
    }
    /* ============

    tmpkey VARIABLE IT'S USED FOR TEMPORAL DIFFERENT KEY
    LIKE IF YOU DON'T WANT TO USE THE PERMANENT KEY, AND YOU ARE GOING TO USE IT ONLY ONE TIME
    YOU CAN USE THIS PARAMETER WITHOUT CHANGING THE REAL KEY

    SYNTAX: [key, str]

    ==============*/

    // FNC TO ENCRYPT THE TEXT FROM 
    encryptStr(str, tmpkey){
        var key, index, charcode, eChar, eStr; // INIT THE KEY FOR ENCRYPT

        // IF tmpkey EXIST CHOOSE THE tmpkey
        if(tmpkey){
            key = this.strToArr(tmpkey[0], tmpkey[1]);
        }else{
            key = this.key;
        }

        index = 0;
        charcode = [];
        eChar = [];

        // CONVERT TEXT TO CHARCODE
        str.split('').forEach(el => {
            charcode.push(this.charList.type == 'own' ? this.charList.list.indexOf(el) : el.charCodeAt());
        });

        // ADD THE KEY
        charcode.forEach(el =>{

            let result = el + key[index];
            result = result >= this.charList.range ? Math.abs((result - this.charList.range) + (this.charList.type != 'own' ? 32 : 0)) : result; // Remove 32 first empty char
            eChar.push(result);

            //BACK TO INDEX 0
            if(index == key.length-1){
                index = 0;
            }else{
                index++;
            }
        });

    
        // ENCRYPTED CHARCODE TO TEXT
        eStr = '';
        eChar.forEach(el => eStr += this.charList.type == 'own' ? this.charList.list[el] : String.fromCharCode(el));

        return eStr;
    }

    // FNC TO DECRYPT THE TEXT ENCRYPTED
    dencryptStr(str, tmpkey){
        // =================
        var key, index, charcode, eChar, eStr; // INIT THE KEY FOR ENCRYPT

        // IF tmpkey EXIST CHOOSE THE tmpkey
        if(tmpkey){
            key = this.strToArr(tmpkey[0], tmpkey[1]);
        }else{
            key = this.key;
        }

        index = 0;
        charcode = [];
        eChar = [];

        // CONVERT TEXT TO CHARCODE
        str.split('').forEach(el => {
            charcode.push(this.charList.type == 'own' ? this.charList.list.indexOf(el) : el.charCodeAt());
        });

        // REMOVE THE KEY
        charcode.forEach(el =>{
            let result = el - key[index];
            result = result < (this.charList.type != 'own' ? 32 : 0) ? Math.abs((result + this.charList.range) - (this.charList.type != 'own' ? 32 : 0)) : result; // Remove 32 first empty char
            eChar.push(result);

            //BACK TO INDEX 0
            if(index == key.length-1){
                index = 0;
            }else{
                index++;
            }
        });
    

        // ENCRYPTED CHARCODE TO TEXT
        eStr = '';
        eChar.forEach(el => eStr += this.charList.type == 'own' ? this.charList.list[el] : String.fromCharCode(el));
        
        return eStr;
    }
}

// let CharVar = new KeyStr('0');

// let Chacode = new OwnCharList('utf-8');


// let ownlist = ['b', 'a', 'c', 'd', 'f', 'e', 'g', 'l', 'w', 'h', 'j', 's', 'i', 'o', 'r', ' '];
// let Charcode = new OwnCharList('own');
// Charcode.createList(ownlist);

// CharVar.importCharList(Charcode);

// console.log(CharVar.encryptStr('world', ['4 5 3', ' ']));
// console.log(CharVar.dencryptStr('icasw', ['4 5 3', ' ']), CharVar.charList.range);


// For node only
// module.exports = {
//     KeyStr,
//     OwnCharList
// };