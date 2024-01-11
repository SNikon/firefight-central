use anyhow::{Context,Result};
use aws_sdk_polly::{Client, types::{OutputFormat, VoiceId, Engine, TextType}, primitives::AggregatedBytes};

pub async fn synthesize_text(client: &Client, text: &String) -> Result<AggregatedBytes> {
	println!("Synthesizing: {}", text);
    let resp = client
        .synthesize_speech()
        .output_format(OutputFormat::Mp3)
        .text_type(TextType::Ssml)
        .text(text)
        .voice_id(VoiceId::Ines)
        .engine(Engine::Neural)
        .send()
        .await
		.context("Failed to synthesize speech")?;

    // Get MP3 data from response and save it
    let blob = resp
        .audio_stream
        .collect()
        .await
		.context("Failed to collect audio stream")?;

	println!("Synthesized buffer received for text: {}", text);
	Ok(blob)
}