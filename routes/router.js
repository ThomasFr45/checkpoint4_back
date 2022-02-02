import itemController from '../controllers/itemController.js';
import recipeController from '../controllers/recipeController.js';
import userController from '../controllers/userController.js';
import orderController from '../controllers/orderController.js';

export const setupRoutes = (app) => {
    app.use('/item', itemController);
    app.use('/recipe', recipeController);
    app.use('/user', userController);
    app.use('/order', orderController);
    
    // ... les autres routes ...
}