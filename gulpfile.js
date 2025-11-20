const gulp = require("gulp");
const pug = require("gulp-pug");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const fs = require("fs");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const sourseMaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const ifPlugin = require("gulp-if");
const path = require("path");
const replace = require("gulp-replace");
const gulpHtmlBemValidator = require("gulp-html-bem-validator");
const browserSync = require("browser-sync").create();
const cssmin = require("gulp-cssmin");
const gcmq = require("gulp-group-css-media-queries");
const sass = require("gulp-sass")(require("sass"));
const webpack = require("webpack-stream");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rename = require("gulp-rename");
const postcssCustomMedia = require("postcss-custom-media");
const svgSprite = require("gulp-svg-sprite");
global.app = {
	isDev: !process.argv.includes("--build"),
	isBuild: process.argv.includes("--build"),
};

// получение папок
function getFolders(dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}

const buildFolder = "docs";
const srcFolder = "src";
var p = {
	docs: {
		html: `${buildFolder}/`,
		test: `${buildFolder}/test/`,
		testimg: `${buildFolder}/test/img/`,
		js: `${buildFolder}/js/`,
		sprite: `${buildFolder}/img/icons`,
		json: `${buildFolder}/json/`,
		css: `${buildFolder}/css/`,
		img: `${buildFolder}/img/`,
		video: `${buildFolder}/video/`,
		audio: `${buildFolder}/audio/`,
		fonts: `${buildFolder}/fonts/`,
		vendor: `${buildFolder}/vendor/`,
	},
	src: {
		icons: `${srcFolder}/sprites/*.svg`,
		layout_pug: `${srcFolder}/layout/*.pug`,
		test_pug: `${srcFolder}/**/*.test`,
		mixin_pug: `${srcFolder}/**/*.mixin`,
		indexStyle: `${srcFolder}/layout/css/index.scss`,
		css: `${srcFolder}/layout/css/`,
		style: `${srcFolder}/layout/css/*.scss`,
		pages: `${srcFolder}/pages`,
		conponents: `${srcFolder}/components`,
		json: `${srcFolder}/**/*.json`,
		audio: `${srcFolder}/**/*.{mp3,wav,flac}`,
		video: `${srcFolder}/**/*.{mp4,avi}`,
		fonts: [`${srcFolder}/fonts/**/*.*`],
		vendor: [`${srcFolder}/vendor/*.*`],
		img: [
			`${srcFolder}/**/*.svg`,
			`!${srcFolder}/sprites/*.*`,
			`!${srcFolder}/fonts/*.*`,
		],
		testjs: [`${srcFolder}/**/test.js`],
		js: [`${srcFolder}/**/*.js`, `!${srcFolder}/vendor/*.*`],
		webp: [
			`${srcFolder}/**/*.{png,jpg}`,
			`!${srcFolder}/**/test/*.{png,jpg,webp}`,
		],
		testimg: `${srcFolder}/**/test/*.{png,jpg,webp}`,
	},
	clean: `${buildFolder}`,
};

//сервер
gulp.task("server", function () {
	browserSync.init({
		server: {
			baseDir: `${buildFolder}`,
		},
	});
	gulp.watch(`${buildFolder}/**/*.{html,css,js}`).on(
		"change",
		browserSync.reload
	);
});

// удаление папки `${buildFolder}`
gulp.task("clean", function () {
	return gulp.src(p.clean, { read: false }).pipe(clean());
});

//Сбор миксинов
gulp.task("page-mixin", function (done) {
	return gulp
		.src(p.src.mixin_pug)

		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: "Template",
					message: "<%= error.message %>",
				}),
			})
		)
		.pipe(concat("mixin.pug"))
		.pipe(gulp.dest(`${srcFolder}/layout`));
});
//Сбор миксинов
gulp.task("page-test", function (done) {
	return gulp
		.src(p.src.test_pug)

		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: "Template",
					message: "<%= error.message %>",
				}),
			})
		)
		.pipe(pug({ pretty: true }))
		.pipe(
			rename({
				prefix: "_test-",
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.html));
});

let svgspriteConfig = {
	shape: {
		dimension: {
			// Set maximum dimensions
			maxWidth: 500,
			maxHeight: 500,
		},
		spacing: {
			// Add padding
			padding: 0,
		},
	},
	mode: {
		symbol: {
			dest: ".",
			sprite: "sprite.svg",
		},
	},
};

gulp.task("svg-sprite", function (done) {
	return gulp
		.src(p.src.icons)

		// .pipe(svgSprite(svgspriteConfig))
		.pipe(gulp.dest(p.docs.sprite));
	done();
});

//Сбор всех html
gulp.task("pages-pug", function (done) {
	var folders = getFolders(p.src.pages);
	if (folders.length === 0) return done(); // nothing to do!
	var tasks = folders.map(function (folder) {
		return gulp
			.src(path.join(p.src.pages, folder, "/*.pug"))
			.pipe(plumber())
			.pipe(
				plumber({
					errorHandler: notify.onError({
						title: "Template",
						message: "<%= error.message %>",
					}),
				})
			)
			.pipe(pug({ pretty: true }))
			.pipe(gulpHtmlBemValidator())
			.pipe(rename(function(file) {
      // Убираем папки, оставляем только имя файла
      file.dirname = '';
    }))
			.pipe(gulp.dest(p.docs.html));
	});
	done();
});

//Сбор html измененной страницы
gulp.task("page-pug", function (done) {
	var folders = getFolders(p.src.pages);
	if (folders.length === 0) return done(); // nothing to do!
	var tasks = folders.map(function (folder) {
		return gulp
			.src(path.join(p.src.pages, folder, "/*.pug"))
			.pipe(
				newer({
					dest: p.docs.html + "/" + folder + ".html",
					extra: path.join(p.src.pages, folder, "/**/*.pug"),
				})
			)
			.pipe(
				plumber({
					errorHandler: notify.onError({
						title: "Template",
						message: "<%= error.message %>",
					}),
				})
			)

			.pipe(pug({ pretty: true }))
			.pipe(gulpHtmlBemValidator())
			.pipe(rename(function(file) {
      // Убираем папки, оставляем только имя файла
      file.dirname = '';
    }))
			.pipe(gulp.dest(p.docs.html));
	});
	done();
});

// Сбор стилей
gulp.task("scss", function (done) {
	return gulp
		.src([
			p.src.conponents + "/**/*.scss",
			p.src.pages + "/**/*.scss",
		])
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: "Styles",
					message: "<%= error.message %>",
				}),
			})
		)
		.pipe(ifPlugin(app.isDev, sourseMaps.init()))
		// .pipe(concat("style.css"))
		.pipe(sass().on("error", sass.logError))
		// .pipe(ifPlugin(app.isBuild, cssmin()))
		.pipe(gcmq())
		// .pipe(ifPlugin(app.isDev, sourseMaps.write('.')))
		.pipe(browserSync.stream())
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.css));
});

gulp.task("listing", function (done) {
	var content =
		"<html><head><meta content='width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport'></head><body style='background:#212121'><style>a{font-family: Arial; color: white;font-size: 17px; }ul{   color: #fff; max-width:1000px; list-style: square; margin: 30px auto; border: 1px solid #00ff7e;  padding: 10px 40px;box-sizing: border-box;} a:hover{text-decoration:none;}</style><ul style=''>";
	fs.readdirSync(`${buildFolder}`).forEach((file) => {
		if (file.split(".").pop() == "html" && file.indexOf("_test-")) {
			content =
				content +
				"<li  style='margin:15px 0'>  <a href='" +
				file +
				"' >" +
				file +
				"</a></li>";
		}
	});
	fs.writeFile(`${buildFolder}/index.html`, content, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Файл создан");
		}
	});

	done();
});

// обработка json
gulp.task("json", function () {
	return gulp.src(p.src.json).pipe(rename(function(file) {
      // Убираем папки, оставляем только имя файла
      file.dirname = '';
    })).pipe(gulp.dest(p.docs.json));
});

gulp.task("vendor", function () {
	return gulp.src(p.src.vendor).pipe(gulp.dest(p.docs.vendor));
});

// обработка audio
gulp.task("audio", function () {
	return gulp.src(p.src.audio).pipe(gulp.dest(p.docs.audio));
});

// обработка video
gulp.task("video", function () {
	return gulp
		.src(p.src.video)
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.video));
});

// обработка fonts
gulp.task("fonts", function () {
	return gulp.src(p.src.fonts).pipe(gulp.dest(p.docs.fonts));
});

// обработка img-icons
gulp.task("img", function () {
	return gulp
		.src(p.src.img)
		.pipe(newer(p.docs.img))
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.img));
});

// обработка всех test img
gulp.task("test-img", function () {
	return gulp
		.src(p.src.testimg)
		.pipe(newer(p.docs.testimg))
		.pipe(webp({ quality: 100 }))
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.testimg));
});

// обработка всех WEBP
gulp.task("webp-all", function () {
	return gulp
		.src(p.src.webp)
		.pipe(webp())
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.img));
});

// обработка новых WEBP
gulp.task("webp", function () {
	return gulp
		.src(p.src.webp)
		.pipe(newer(p.docs.img))
		.pipe(webp())
		.pipe(
			rename({
				dirname: "",
			})
		)
		.pipe(gulp.dest(p.docs.img));
});

// создать компонент или таблицу
gulp.task("create", function (done) {
	const name = process.argv[4];
	const type = process.argv[3];
	const modules = process.argv[5] || "";
	const jsContent = "";
	if (type == "--page" || type == "--p") {
		let dir = p.src.pages + "/" + name;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			if (~modules.indexOf("i") || modules == "") {
				fs.mkdirSync(`${dir}/img`);
			}
			if (~modules.indexOf("m") || modules == "") {
				fs.writeFile(dir + "/" + name + ".mixin", "", function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Mixin файл создан");
					}
				});
			}
			if (~modules.indexOf("t") || modules == "") {
				fs.writeFile(dir + "/" + name + ".pug", "", function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Pug файл создан");
					}
				});
			}
			if (~modules.indexOf("s") || modules == "") {
				fs.writeFile(dir + "/" + name + ".scss", "", function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Scss файл создан");
					}
				});
			}
			if (~modules.indexOf("j") || modules == "") {
				fs.writeFile(dir + "/index.js", jsContent, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Js файл создан");
					}
				});
			}
			console.log("Создание папки ", name);
		}
	} else if (type == "--component" || type == "--c") {
		let dir = p.src.conponents + "/" + name;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			if (~modules.indexOf("i") || modules == "") {
				fs.mkdirSync(`${dir}/img`);
			}
			fs.writeFile(dir + "/" + name + ".pug", "", function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Pug файл создан");
				}
			});
			if (~modules.indexOf("m") || modules == "") {
				fs.writeFile(dir + "/" + name + ".mixin", "", function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Mixin файл создан");
					}
				});
			}
			if (~modules.indexOf("s") || modules == "") {
				fs.writeFile(dir + "/" + name + ".scss", "", function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Scss файл создан");
					}
				});
			}
			if (~modules.indexOf("j") || modules == "") {
				fs.writeFile(dir + "/index.js", jsContent, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Js файл создан");
					}
				});
			}
			console.log("Создание компонента ", name);
		}
	} else {
		console.log("Ничего не созданно");
	}

	done();
});

gulp.task("watch", function () {
	gulp.watch(p.src.js, gulp.parallel("js"));
	gulp.watch(p.src.testjs, gulp.parallel("test-js"));
	gulp.watch(p.src.icons, gulp.parallel("svg-sprite"));
	gulp.watch(
		[p.src.test_pug, p.src.mixin_pug],
		gulp.parallel(["page-mixin", "page-test"])
	);

	gulp.watch(
		[p.src.layout_pug, p.src.conponents + "/**/*.pug"],
		gulp.parallel("pages-pug")
	);
	gulp.watch(p.src.pages + "/**/*.pug", gulp.parallel("page-pug"));
	gulp.watch(
		[
			p.src.style,
			p.src.conponents + "/**/*.scss",
			p.src.pages + "/**/*.scss",
		],
		gulp.parallel("scss")
	);
	gulp.watch(p.src.img, gulp.parallel("img"));
	gulp.watch(p.src.testimg, gulp.parallel("test-img"));
	gulp.watch(p.src.webp, gulp.parallel("webp"));
	gulp.watch(p.src.json, gulp.parallel("json"));
	gulp.watch(p.src.vendor, gulp.parallel("vendor"));
	gulp.watch(p.src.audio, gulp.parallel("audio"));
	gulp.watch(p.src.video, gulp.parallel("video"));
	gulp.watch(p.src.fonts, gulp.parallel("fonts"));
	gulp.watch(`${buildFolder}/*.html`).on("add", gulp.parallel("listing"));
});

// Сборка js
gulp.task("js", function () {
	return gulp
		.src(p.src.js)
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: "JavaScript",
					message: "<%= error.message %>",
				}),
			})
		)
		// .pipe(
		// 	webpack({
		// 		mode: app.isBuild ? "development" : "production",
		// 		entry: {
		// 			main: "./src/index.js",
		// 		},

		// 		output: {
		// 			filename: "[name].js",
		// 			chunkFilename: "[name].js",
		// 			publicPath: "/",
		// 		},

		// 		optimization: {
		// 			splitChunks: {
		// 				cacheGroups: {
		// 					vendor: {
		// 						test: /node_modules/,
		// 						chunks: "initial",
		// 						name: "vendor",
		// 						enforce: true,
		// 					},
		// 				},
		// 			},
		// 		},
		// 		plugins: [new MiniCssExtractPlugin()],
		// 		devtool: "source-map",
		// 		module: {
		// 			rules: [
		// 				{
		// 					test: /\.js$/,
		// 					exclude: /node_modules/,
		// 					use: {
		// 						loader: require.resolve("babel-loader"),
		// 						options: {
		// 							sourceMaps: true,
		// 							presets: [
		// 								[
		// 									"@babel/preset-env",
		// 									{ modules: false },
		// 								],
		// 							],
		// 						},
		// 					},
		// 				},
		// 				{
		// 					test: /\.css$/i,
		// 					use: [MiniCssExtractPlugin.loader, "css-loader"],
		// 				},
		// 			],
		// 		},

		// 		resolve: {
		// 			alias: {
		// 				Pages: path.resolve(__dirname, "src/pages"),
		// 				Components: path.resolve(__dirname, "src/components"),
		// 			},
		// 		},
		// 	})
		// )
		.pipe(
			rename({
				dirname: "",
			})
		).pipe(gulp.dest(p.docs.js));
});
gulp.task("test-js", function () {
	return gulp
		.src(p.src.testjs)
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: "JavaScript",
					message: "<%= error.message %>",
				}),
			})
		)
		.pipe(
			webpack({
				mode: app.isBuild ? "development" : "production",
				entry: {
					main: "./src/pages/test/test.js",
				},

				output: {
					filename: "test.js",
					chunkFilename: "[name].js",
					publicPath: "/",
				},

				// plugins: [new MiniCssExtractPlugin()],
				module: {
					rules: [
						{
							test: /\.js$/,
							exclude: /node_modules/,
							use: {
								loader: require.resolve("babel-loader"),
								options: {
									presets: [
										[
											"@babel/preset-env",
											{ modules: false },
										],
									],
								},
							},
						},
						// {
						// 	test: /\.css$/i,
						// 	use: [MiniCssExtractPlugin.loader, "css-loader"],
						// },
					],
				},

				// resolve: {
				// 	alias: {
				// 		Pages: path.resolve(__dirname, "src/pages"),
				// 		Components: path.resolve(__dirname, "src/components"),
				// 	},
				// },
			})
		)
		.pipe(gulp.dest(p.docs.js));
});

gulp.task(
	"build",
	gulp.series(
		"clean",
		"scss",
		"js",
		"svg-sprite",
		"pages-pug",
		"webp",
		"img",
		"fonts",
		"json",
		"vendor",
		"audio",
		"video",
		"listing"
	)
);
gulp.task("default", gulp.parallel("watch", "server"));
