use anyhow::{Context, Result};
use aws_sdk_polly::{
    primitives::AggregatedBytes,
    types::{Engine, LanguageCode, OutputFormat, TextType, VoiceId},
    Client,
};

pub enum Synthesizable {
    Occurrence(String),
    Pattern(String),
    Raw(String),
    Staff(String),
    Vehicle(String),
}

static SLOW_SPEECH: &str = "<speak><prosody rate=\"medium\"><amazon:effect name=\"drc\">";
static X_SLOW_SPEECH: &str = "<speak><prosody rate=\"slow\"><amazon:effect name=\"drc\">";
static SPEECH_END: &str = "</amazon:effect></prosody></speak>";

impl Synthesizable {
    pub fn to_speech(&self) -> String {
        match self {
            Synthesizable::Occurrence(label) => format!("{}Saída <phoneme alphabet=\"ipa\" ph=\"pɐ.ɾɐ\">para</phoneme> <break strength=\"weak\" /> {}{}", SLOW_SPEECH, label, SPEECH_END),
            Synthesizable::Pattern(label) => format!("{}{}{}", SLOW_SPEECH, label, SPEECH_END),
            Synthesizable::Vehicle(label) => format!("{}<say-as interpret-as=\"spell-out\">{}</say-as>{}",
                X_SLOW_SPEECH,
                label
                    .to_uppercase()
                    .replace("S", "</say-as><phoneme alphabet=\"ipa\" ph=\"ˈɛs\">S</phoneme><say-as interpret-as=\"spell-out\">"),
                SPEECH_END),
            Synthesizable::Raw(text) => text.clone(),
            Synthesizable::Staff(label) => format!("{}{}{}", SLOW_SPEECH, label.trim_start_matches('0'), SPEECH_END),
        }
    }
}

async fn synthesize_text(client: &Client, text: &String) -> Result<AggregatedBytes> {
    println!("Synthesizing: {}", text);
    let resp = client
        .synthesize_speech()
        .output_format(OutputFormat::OggVorbis)
        .text_type(TextType::Ssml)
        .text(text)
        .voice_id(VoiceId::Ines)
        .language_code(LanguageCode::PtPt)
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

pub async fn synthesize(client: &Client, value: &Synthesizable) -> Result<AggregatedBytes> {
    let speech_text = value.to_speech();
    synthesize_text(client, &speech_text).await
}
