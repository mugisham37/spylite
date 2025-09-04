import GSAPTest from "@/components/test/GSAPTest";
import { MessageSection } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Test Hero Section with Custom Classes */}
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Tailwind CSS</h1>
          <div className="hero-text-scroll">
            <div className="hero-subtitle">
              <h1>Setup Complete</h1>
            </div>
          </div>
          <h2>
            Custom theme colors, fonts, and utility classes successfully
            migrated from the original project.
          </h2>
          <button className="hero-button">✓ Working</button>
        </div>
      </div>

      {/* Test Custom Utility Classes */}
      <div className="min-h-screen bg-dark-brown relative">
        <div className="flex-center h-full">
          <div className="col-center gap-8 p-8 relative">
            <h1 className="general-title text-milk text-center">
              Custom Utilities
            </h1>
            <div className="flex gap-8 flex-wrap justify-center">
              <div className="bg-light-brown p-6 rounded-lg">
                <p className="font-paragraph text-dark-brown font-bold">
                  flex-center ✓
                </p>
              </div>
              <div className="bg-mid-brown p-6 rounded-lg">
                <p className="font-paragraph text-white font-bold">
                  col-center ✓
                </p>
              </div>
              <div className="bg-milk p-6 rounded-lg">
                <p className="font-paragraph text-dark-brown font-bold">
                  general-title ✓
                </p>
              </div>
            </div>
            <div className="relative w-32 h-32 bg-red-brown rounded-lg">
              <div className="abs-center bg-milk p-2 rounded text-xs">
                <p className="font-paragraph text-dark-brown font-bold">
                  abs-center ✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Color Palette */}
      <div className="min-h-screen bg-milk-yellow p-8">
        <h2 className="general-title text-dark-brown text-center mb-12">
          Color Palette
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-black p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-black rounded mb-4"></div>
            <p className="text-white font-paragraph font-bold">black</p>
            <p className="text-white font-paragraph text-sm">#222123</p>
          </div>
          <div className="bg-dark-brown p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-dark-brown rounded mb-4"></div>
            <p className="text-white font-paragraph font-bold">dark-brown</p>
            <p className="text-white font-paragraph text-sm">#523122</p>
          </div>
          <div className="bg-mid-brown p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-mid-brown rounded mb-4"></div>
            <p className="text-white font-paragraph font-bold">mid-brown</p>
            <p className="text-white font-paragraph text-sm">#a26833</p>
          </div>
          <div className="bg-light-brown p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-light-brown rounded mb-4"></div>
            <p className="text-dark-brown font-paragraph font-bold">
              light-brown
            </p>
            <p className="text-dark-brown font-paragraph text-sm">#e3a458</p>
          </div>
          <div className="bg-red-brown p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-red-brown rounded mb-4"></div>
            <p className="text-white font-paragraph font-bold">red-brown</p>
            <p className="text-white font-paragraph text-sm">#7f3b2d</p>
          </div>
          <div className="bg-red p-6 rounded-lg text-center">
            <div className="w-full h-16 bg-red rounded mb-4"></div>
            <p className="text-white font-paragraph font-bold">red</p>
            <p className="text-white font-paragraph text-sm">#a02128</p>
          </div>
          <div className="bg-milk p-6 rounded-lg border-2 border-dark-brown text-center">
            <div className="w-full h-16 bg-milk rounded mb-4 border border-dark-brown"></div>
            <p className="text-dark-brown font-paragraph font-bold">milk</p>
            <p className="text-dark-brown font-paragraph text-sm">#faeade</p>
          </div>
          <div className="bg-milk-yellow p-6 rounded-lg border-2 border-dark-brown text-center">
            <div className="w-full h-16 bg-milk-yellow rounded mb-4 border border-dark-brown"></div>
            <p className="text-dark-brown font-paragraph font-bold">
              milk-yellow
            </p>
            <p className="text-dark-brown font-paragraph text-sm">#e3d3bc</p>
          </div>
        </div>
      </div>

      {/* Test Responsive Breakpoints */}
      <div className="min-h-screen bg-red-brown flex-center">
        <div className="col-center gap-8 p-8">
          <h1 className="text-milk text-2xl md:text-4xl 2xl:text-6xl font-bold text-center">
            Responsive Breakpoints
          </h1>
          <p className="font-paragraph text-milk text-center max-w-md md:max-w-lg 2xl:max-w-2xl text-sm md:text-base 2xl:text-lg">
            This layout adapts to different screen sizes using the same
            responsive breakpoints as the original project (md: 768px, 2xl:
            1536px).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
            <div className="bg-milk p-6 rounded-lg text-center">
              <p className="font-paragraph text-dark-brown font-bold">Mobile</p>
              <p className="font-paragraph text-dark-brown text-sm">1 column</p>
            </div>
            <div className="bg-milk p-6 rounded-lg text-center">
              <p className="font-paragraph text-dark-brown font-bold">
                Tablet (md)
              </p>
              <p className="font-paragraph text-dark-brown text-sm">
                2 columns
              </p>
            </div>
            <div className="bg-milk p-6 rounded-lg text-center">
              <p className="font-paragraph text-dark-brown font-bold">
                Desktop (2xl)
              </p>
              <p className="font-paragraph text-dark-brown text-sm">
                3 columns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Font Families */}
      <div className="min-h-screen bg-milk flex-center">
        <div className="col-center gap-8 p-8 max-w-4xl">
          <h1 className="general-title text-dark-brown text-center">
            Font Test
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="bg-dark-brown p-8 rounded-lg text-center">
              <h3 className="text-milk text-2xl font-bold mb-4">
                Antonio Font
              </h3>
              <p className="text-milk font-sans text-lg">
                This is the Antonio font family used for headings and titles.
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
            </div>
            <div className="bg-light-brown p-8 rounded-lg text-center">
              <h3 className="text-dark-brown text-2xl font-bold mb-4">
                ProximaNova Font
              </h3>
              <p className="text-dark-brown font-paragraph text-lg">
                This is the ProximaNova font family used for body text and
                paragraphs. ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GSAP Test Section */}
      <div className="min-h-screen bg-red-brown flex-center">
        <div className="col-center gap-8 p-8 max-w-4xl w-full">
          <h1 className="general-title text-milk text-center">
            GSAP Integration Test
          </h1>
          <GSAPTest />
          <p className="font-paragraph text-milk text-center max-w-2xl">
            This section tests the GSAP provider and error boundary
            implementation. The animation should run smoothly without any
            hydration issues.
          </p>
        </div>
      </div>

      {/* MessageSection Test */}
      <MessageSection />
    </div>
  );
}
