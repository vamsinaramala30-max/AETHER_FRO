# AETHER High-Resolution Motion Assets

This directory serves high-bitrate visual demos for the hero sections and feature walkthrough landing pages.

## Asset Requirements

| Asset Name | Spec Target | Codec / Container | Usage |
| :--- | :--- | :--- | :--- |
| `hero-demo.mp4` | 1920x1080 @ 60fps | H.264 / MP4 | Landing Page Hero Loop |
| `dashboard-preview.mp4` | 1920x1080 @ 30fps | H.264 / MP4 | Feature Showcase Interactive Modal |

> **Note**: Binary video files are managed via Git LFS or external CDN edge deployment during production build pipelines. Ensure web-optimized streaming flags (`-movflags +faststart`) are enabled.