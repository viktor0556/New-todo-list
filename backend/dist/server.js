"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const users_sign_in_up_1 = __importDefault(require("./routes/users-sign-in-up"));
const user_datas_1 = __importDefault(require("./routes/user-datas"));
const guest_1 = __importDefault(require("./routes/guest"));
app.use('/', users_sign_in_up_1.default);
app.use('/', user_datas_1.default);
app.use('/', guest_1.default);
app.get('/', (req, res) => {
    res.send('There is nothing to see!');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
