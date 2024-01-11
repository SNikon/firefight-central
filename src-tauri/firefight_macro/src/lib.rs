use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(StructEntries)]
pub fn firefight_macro(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse::<syn::DeriveInput>(input).unwrap();

    // Build the trait implementation
    let name = ast.ident;
    let params: Vec<String> = match ast.data {
        syn::Data::Struct(data) => data.fields
            .into_iter()
            .filter_map(|f| f.ident)
            .map(|f| f.to_string())
            .collect(),
        _ => panic!("Only structs are supported"),
    };
    
    let gen = quote! {
        impl StructEntries for #name {            
            fn entries(&self) -> Vec<(&str, serde_json::Value)> {
                // iterate through params and return the values of self that match params as key
                vec![
                    #( (#params, serde_json::to_value(&self.#params).unwrap()) ),*
                ]
            }
        }
    };
    gen.into()
}
