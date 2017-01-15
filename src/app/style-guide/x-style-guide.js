 Polymer({
     is: `x-style-guide`,
     properties: {
         minDate: {
             type: Date,
             value: new Date(2016, 11 - 1, 24)
         },
         maxDate: {
             type: Date,
             value: new Date(2016, 12 - 1, 24)
         }
     },
     behaviors: [
         Polymer.Behaviors.Resource
     ],
     onNotifyEvent() {
         this.fire(`on-notify-event`, { message: `Fyll i anläggningsuppgifter för att få el inom ` + Math.floor(Math.random() * 90 + 10) + ` dagar.`});
     },
     onAffirmationEvent() {
         this.fire(`on-notify-event`, { affirmation: `Fyll i anläggningsuppgifter för att få el inom ` + Math.floor(Math.random() * 90 + 10) + ` dagar.` });
     }
 });