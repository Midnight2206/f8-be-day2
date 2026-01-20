import {findUserByEmail} from "#models/user.model.js";
export const searchUsersByEmailService = async (email) => {
    const user = await findUserByEmail({email});
    if (!user) {
        return [];
    }
    return [user];
}