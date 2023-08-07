export interface BotType {
    type: String;
    status: String;
    name: String;
    id: String;
}

export interface Inputs {
    email: String;
    username: String;
    password: String;
    passwordconf: String;
}

export interface DiscordInputs {
    bot_name: string;
    discord_token: string;
    debug_guild: string;
    debug_channel: string;
    allowed_guilds: string;
    moderations_alert_channel: string;
    admin_roles: string;
    dalle_roles: string;
    gpt_roles: string;
    translator_roles: string;
    search_roles: string;
    index_roles: string;
    channel_chat_roles: string;
    channel_instruction_roles: string;
    chat_bypass_roles: string;
    summarize_roles: string;
    user_input_api_keys: string;
    user_key_db_path: string;
    max_search_price: string;
    max_deep_compose_price: string;
    custom_bot_name: string;
    welcome_message: string;
    bot_taggable: string;
    pre_moderate: string;
    force_english: string;

}

export interface TelegramInputs {
    bot_name: string;
    TELEGRAM_BOT_TOKEN: string;
    N_IMAGE_MODES_PER_PAGE: string;
    ADMIN_USER_IDS: string;
    ALLOWED_TELEGRAM_USER_IDS: string;
    BLACKLISTED_TELEGRAM_USER_IDS: string;
    GROUP_TRIGGER_KEYWORD: string;
    TELEGRAM_CORE_API_HASH: string;
    TELEGRAM_CORE_API_ID: string;
    SUMMARIZE_MESSAGE_COUNT: string;
}