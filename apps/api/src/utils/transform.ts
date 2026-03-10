/**
 * Transform Prisma responses to match frontend expectations
 * Converts PascalCase relation names to camelCase
 */

export const transformItem = (item: any) => {
    if (!item) return null;

    return {
        ...item,
        options: item.ItemOption?.map((option: any) => ({
            ...option,
            choices: option.OptionChoice || []
        })) || [],
        addons: item.ItemAddon || [],
        variants: item.Variant || [],
        // Remove PascalCase versions
        ItemOption: undefined,
        ItemAddon: undefined,
        Variant: undefined
    };
};

export const transformCategory = (category: any) => {
    if (!category) return null;

    return {
        ...category,
        items: (category.items || category.Item)?.map(transformItem) || [],
        Item: undefined,
        items_prisma: undefined // cleanup if needed
    };
};

export const transformUser = (user: any) => {
    if (!user) return null;

    // User object is already in correct format, just ensure consistency
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
    };
};

export const transformAuthResponse = (token: string, user: any) => {
    return {
        token,
        user: transformUser(user)
    };
};

export const transformOrder = (order: any) => {
    if (!order) return null;

    return {
        ...order,
        user: order.User,
        items: order.OrderItem,
        address: order.Address,
        deliveryPartner: order.DeliveryPartner,
        // Remove PascalCase versions
        User: undefined,
        OrderItem: undefined,
        Address: undefined,
        DeliveryPartner: undefined
    };
};
