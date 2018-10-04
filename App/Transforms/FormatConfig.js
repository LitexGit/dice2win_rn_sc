export default (config: object) => {
    let apis = = config.api_list
    delete config.api_list
    return {...config, apis}
}