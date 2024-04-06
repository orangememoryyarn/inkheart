/*
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const nlp = winkNLP(model);

let text = "";

const its = nlp.its;
const as = nlp.as;
const doc = nlp.readDoc(text);

stem = doc.out(its.stem);
lemma = doc.out(its.lemma);
console.log(lemma);
*/

var lemmatizer = new Lemmatizer();
alert(lemmatizer.lemmas("desks", "noun"));
