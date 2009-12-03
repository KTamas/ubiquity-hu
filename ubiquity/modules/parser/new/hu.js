/***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ubiquity.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Michael Yoshitaka Erlewine <mitcho@mitcho.com>
 *   Jono DiCarlo <jdicarlo@mozilla.com>
 *   Brandon Pung <brandonpung@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

function makeParser() {
 var hu = new Parser('hu');
 hu.usespaces = true;
 hu.joindelimiter = "";
 hu.roles = [
   {role: 'goal', delimiter: 'ba'},
   {role: 'goal', delimiter: 'be'},
   {role: 'goal', delimiter: 'ra'},
   {role: 'goal', delimiter: 're'},
   {role: 'source', delimiter: 'ból'},
   {role: 'source', delimiter: 'ből'},
   {role: 'source', delimiter: 'ról'},
   {role: 'source', delimiter: 'ről'},
   {role: "format", delimiter: "ban"},
   {role: "format", delimiter: "ben"},   
   {role: "format", delimiter: "ul"},   
   {role: "format", delimiter: "ül"},      
 ];

 hu.argumentNormalizer = new RegExp("(^(az?)\\s+)(.*)$", "i");
 hu.normalizeArgument = function(input) {
   // pt-ből örököltük, tök jó.
   let matches = input.match(this.argumentNormalizer);
   if (matches != null)
     return [{prefix:matches[1], newInput:matches[3], suffix:''}];
   return [];
 };


 hu.initializeLanguage = function() {
   this._patternCache.particleMatcher = new RegExp('('+[role.delimiter for each (role in this.roles)].join('|')+')','g');
 }
 hu.wordBreaker = function(input) {
   // Szedjük le a toldalékokat.
   // Toldalék: minden, amit fent delimiterként definiáltunk.
   // Ha a szavunk ige, nem bántjuk. (Különben: elviRA)
   var verbs = [verb.name for each (verb in this._verbList)];
   var szavankent = input.split(" ");
   var uj = []
   for (szo in szavankent) {
     if ( verbs.indexOf(szavankent[szo]) == -1 ) {
       // ha a szavunk nem egy ige       
       uj.push(szavankent[szo].replace(this._patternCache.particleMatcher,'\u200b$1\u200b'));
     } else {
       // ha szavunk egy ige
       // ...ööööö.
       uj.push(szavankent[szo]);
     }
   }
   return uj.join(" ");
 };

 hu.anaphora = ["ezt","azt","ezeket", "azokat","a kijelölést",];

 hu.branching = 'left';

 hu.verbFinalMultiplier = 0.3;

 return hu;
};