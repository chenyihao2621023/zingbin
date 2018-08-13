
class NameAllModulesPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("NameAllModulesPlugin", compilation => {
      compilation.hooks.beforeModuleIds.tap("NameAllModulesPlugin", modules => {
        for (const module of modules) {
          if (module.id === null) {
            module.id = module.identifier();
          }
        }
      });
    });
  }
}

module.exports = NameAllModulesPlugin;