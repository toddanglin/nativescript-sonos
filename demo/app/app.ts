import * as app from 'tns-core-modules/application';
import * as trace from 'tns-core-modules/trace';

app.on(app.launchEvent, () => {
    trace.addCategories(`${trace.categories.Debug},${trace.categories.Error}`)
    trace.enable();
});

app.start({ moduleName: "main-page" });
