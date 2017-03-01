import * as app from 'application';
import * as trace from 'trace';

app.on(app.launchEvent, () => {
    trace.addCategories(`${trace.categories.Debug},${trace.categories.Error}`)
    trace.enable();
});

app.start({ moduleName: "main-page" });
