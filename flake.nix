{
  description = "BrainFunk dev shell";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };
  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };

        stableToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [
            "rust-src"
            "rust-analyzer"
            "clippy"
          ];
        };
        nightlyRustfmt = pkgs.rust-bin.nightly.latest.rustfmt;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            stableToolchain
            nightlyRustfmt

            llvmPackages_22.llvm
            llvmPackages_22.clang
            llvmPackages_22.lld
            llvmPackages_22.libclang
            llvmPackages_22.libllvm
            llvmPackages_22.libcxxClang
            llvmPackages_22.bintools

            pkg-config
            openssl
            cmake
            ninja
            zlib
            zstd
          ];

          shellHook = ''
            export LIBCLANG_PATH="${pkgs.llvmPackages_22.libclang}/lib"
            export CLANG_PATH="${pkgs.llvmPackages_22.clang}/bin/clang"
            export LLD_PATH="${pkgs.llvmPackages_22.lld}/bin/lld"
            export LD_LIBRARY_PATH="${pkgs.llvmPackages_22.libclang}/lib:$LD_LIBRARY_PATH"
            echo "rustc $(rustc --version) | $(which rustc) (stable)"
            echo "rustfmt $(rustfmt --version) | $(which rustfmt) (nightly)"
            echo "clang $(${pkgs.llvmPackages_22.clang}/bin/clang --version | head -1)"
          '';
        };
      }
    );
}
