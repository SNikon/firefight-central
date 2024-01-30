use aws_sdk_polly::{Client, config::{ProvideCredentials, Credentials}};
use aws_config::{Region, meta::region::RegionProviderChain};

pub async fn create_polly_client() -> Client {
	let region_provider = RegionProviderChain::default_provider().or_else(Region::new("eu-west-3"));
	println!("Polly Region: {:?}", region_provider.region().await.unwrap());

    let shared_config = aws_config::from_env()
		.region(region_provider)
		.credentials_provider(Credentials::new(super::config::AWS_ACCESS_KEY_ID, super::config::AWS_SECRET_ACCESS_KEY, None, None, ""))
		.load()
		.await;

	println!("Polly Credentials Config: {:?}", shared_config.credentials_provider().unwrap().provide_credentials().await.unwrap());
	let client = Client::new(&shared_config);
	println!("Polly Client created");
	client
}
