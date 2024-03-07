class Config(object):
    '''
    Base Configuration
    '''

class ProductionConfig(Config):
    '''
    Production Configuration
    '''
    DEBUG = False
class DevelopmentConfig(Config):
    """
    Local Development Configuration
    """
    DEBUG = True
    
config = {"prod": ProductionConfig, "development": DevelopmentConfig}