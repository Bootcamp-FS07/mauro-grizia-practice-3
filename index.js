let model;
let view;

const init = () => {
    model = Model.getInstance();
    view = new View(model);
    view.init();
}

init();