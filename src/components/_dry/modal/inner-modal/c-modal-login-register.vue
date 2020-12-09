<template>
	<div class="modal-log-reg modal-container__modal-log-reg"
		@click.stop=""
	>
		<div class="modal-log-reg__box-close"
			@click="CLOSE_MODAL"
		>
			<span class="modal-log-reg__close"></span>
		</div>

		<div class="login-container">

			<!-- Error from server -->
			<transition name="login-error">
				<div class="login-error"
					v-if="GET_IS_ERROR"
				>
					<p class="login-error__msg">
						{{ GET_ERROR }}
					</p>
				</div>
			</transition>

			<!-- Register form -->
			<form class="login-form"
				novalidate
				@submit.prevent="loginUser"
			>
				<!-- Email -->
				<div class="login-form__box-field">
					<label for="login-form-email" class="login-form__label"
						:class="{ 'login-form__label--active': isActiveClass.email }"
						
					>
						Почта
					</label>
					<input class="login-form__input"
						:class="[
							{ 'login-form__input--active': isActiveClass.email },
							{ 'login-form__input--error': isLoginSubmit && $v.email.$error },
						]"
						type="email"
						autocomplete="off"
						id="login-form-email"
						v-model.trim="email"
						@focus="focusInput('email')"
						@blur="blurInput('email')"
					>
					<span class="login-form__msg-error" 
						v-if="isLoginSubmit && !$v.email.required"
					>Введите почту!</span>
					<span class="login-form__msg-error" 
						v-if="isLoginSubmit && !$v.email.email"
					>Не верно указана почта!</span>
				</div>

				<!-- Password -->
				<div class="login-form__box-field">
					<label for="login-form-password" class="login-form__label"
						:class="{ 'login-form__label--active': isActiveClass.password }"
					>
						Пароль
					</label>
					<input class="login-form__input"
						:class="[
							{ 'login-form__input--active': isActiveClass.password },
							{ 'login-form__input--error': isLoginSubmit && $v.password.$error },
						]"
						type="password"
						autocomplete="off"
						id="login-form-password"
						v-model.trim="password"
						@focus="focusInput('password')"
						@blur="blurInput('password')"
					>
					<span class="login-form__msg-error"
						v-if="isLoginSubmit && !$v.password.required"
					>Введите пароль!</span>
					<span class="login-form__msg-error"
						v-if="isLoginSubmit && !$v.password.minLength"
					>
						Пароль должен состоять минимум из {{ $v.password.$params.minLength.min }} символов!
					</span>
				</div>

				<!-- Submit -->
				<div class="login-form__box-submit">
					<button class="login-form__submit">Войти в кабинет</button>
				</div>
				
				<div class="login-form__register">
					<span class="login-form__question">Нет аккaунта? </span>
					<a href="" class="login-form__link"
						@click.prevent="visitRegisterPage"
					>Зарегистрируйтесь</a>
				</div>

				<!-- Preloader -->
				<div class="auth-preloader login-container__auth-preloader">
					<div class="auth-preloader__preloader"
						:class="classPreloader"
					></div>
				</div>
			</form>
		</div>

	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { email, required, minLength } from 'vuelidate/lib/validators'

export default {
	name: 'cModalLoginRegister',
	data: () => ({
      email: '',
      password: '',
      isLoginSubmit: false,
      isActiveClass: {
         email: false,
         password: false,
		},
		classPreloader: '',
   }),
   validations: {
      email: {
         required,
         email
      },
      password: {
         required,
         minLength: minLength(6)
      },
	},
	computed: mapGetters([
		'GET_IS_ERROR',
		'GET_ERROR',
		'GET_CLASS_OF_PRELOADER'
	]),
	methods: {
      ...mapActions([
			'CLOSE_MODAL',
			'LOGIN_USER',
			'SET_ERROR'
		]),
      visitRegisterPage() {
         if (this.$route.name !== 'Register') {
            this.$router.push({ name: 'Register' });
         }
         
         this.CLOSE_MODAL();
		},
      focusInput(type) {
         this.isActiveClass[type] = true;
      },
      blurInput(type) {
         if (!this[type]) {
            this.isActiveClass[type] = false;
         }
      },
      loginUser() {
         this.isLoginSubmit = true;
         this.$v.$touch();
         if (this.$v.$invalid) return;

			this.LOGIN_USER({
				email: this.email,
				password: this.password
			})
			.then(({ success }) => {
				if (!success) return;

				setTimeout(() => {
					if (this.$route.name !== 'Shop') {
						this.$router.push({ name: 'Shop' });
					}

					this.CLOSE_MODAL();
				}, 100);
			})
      }
	},
	watch: {
		GET_CLASS_OF_PRELOADER(val) {
			this.classPreloader = val;
		}
	},
	created() {
		this.SET_ERROR('');
	},
	beforeDestroy() {
		this.SET_ERROR('');
	}
}
</script>

<style lang="scss">
.modal-container {
	&__modal-log-reg {
		position: relative;
	}
}
.modal-log-reg {
	width: 40rem;
	overflow: hidden;
	padding: 7rem 5rem;
	border: 1px solid #fff;
	background: #fff;
	border-radius: 1rem;
	text-align: center;

	@media (max-width: 499px) {
		width: calc(100vw - 10rem);
	}
	@media (max-width: 460px) {
		width: calc(100vw - 5rem);
	}
	@media (max-width: 375px) {
		padding: 3rem;
	}

	&__box-close {
		width: 2rem;
		height: 2rem;
		position: absolute;
		top: 1rem;
		right: 1rem;
		cursor: pointer;
		transition: .2s;

		&:hover {
			transform: scale(1.2);
		}
	}
	&__close {
		display: block;
		width: 100%;
		height: 100%;
		background: url('/static/icons/close.svg') no-repeat center / cover;
	}
	&__log-reg-box {
		text-align: left;
		padding: 5rem;
		color: #000;
		font-size: 1.8rem;
		font-weight: 600;
	}
}

.login-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	backface-visibility: hidden;

	&__auth-preloader {
		width: 100%;
		height: .7rem;
		position: absolute;
		bottom: 0;
		left: 0;
	}
}
.auth-preloader {
	&__preloader {
		width: 0;
		height: 100%;
		background: #007bff;

		&--start-loading {
			animation: start-loading .2s ease forwards;
			@keyframes start-loading {
				100% { width: 60% }
			}
		}
		&--end-loading {
			width: 60%;
			animation: end-loading .1s ease-in forwards;
			@keyframes end-loading {
				100% { width: 100% }
			}
		}
	}
}
.login-error {
	position: absolute;
	bottom: 3rem;
	padding: 0 3rem;

	&__msg {
		font-size: 1.6rem;
		font-weight: 500;
		color: tomato;
	}
}
.login-error-enter-active {
	animation: login-error-enter .2s;
}
@keyframes login-error-enter {
	0% { transform: translateX(-3rem); }
	25% { transform: translateX(2rem); }
	50% { transform: translateX(-1rem); }
	100% { transform: translateX(0rem); }
}
.login-error-leave-active {
	animation: login-error-leave .2s;
}
@keyframes login-error-leave {
	0% { transform: translateY(1rem); }
	100% { transform: translateY(-4rem); opacity: 0; }
}

.login-form {
	width: 100%;
	border-radius: 2rem;

	&__box-field {
		margin-bottom: 4.5rem;
		position: relative;
	}
	&__label {
		font-size: 2rem;
		color: #000;
		position: absolute;
		top: 0;
		left: 0;
		transition: .2s;
		z-index: 1;

		@media (max-width: 375px) {
			font-size: 1.8rem;
		}

		&--active {
			font-size: 1.6rem;
			top: -1rem;

			@media (max-width: 375px) {
				font-size: 1.4rem;
			}
		}
	}
	&__input {
		width: 100%;
		user-select: none;
		border: none;
		border-bottom: .2rem solid #333;
		caret-color: #000;
		padding: 1rem 0 .2rem .2rem;
		color: #000;
		transition: .2s;

		&--active {
			border-bottom: .2rem solid #000;
		}
		&--error {
			border-bottom: .2rem solid tomato;
		}
	}
	&__msg-error {
		position: absolute;
		left: 0;
		bottom: -3.5rem;
		font-size: 1.1rem;
		color: tomato;
		opacity: 0;
		animation: load-msg .1s forwards;

		@keyframes load-msg {
			100% { bottom: -1.5rem; opacity: 1; }
		}
	}
	&__submit {
		font-size: 2rem;
		padding: 1rem 2rem;
		border-radius: 1rem;
		border: none;
		background: #007bff;
		color: #fff;
		margin-bottom: 1.5rem;
		transition: .2s;

		@media (max-width: 375px) {
			font-size: 1.8rem;
		}
		&:hover {
			box-shadow: 0 0 1rem #007bff;
		}
		&:active {
			transform: scale(.95);
			box-shadow: 0 0 .5rem #007bff;
		}
	}
	&__register {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	&__link {
		color: #336699;
	}
}

.log-reg-box {
	font-weight: 400;
	
	&__link {
		color: #336699;
		font-weight: 500;
	}
}
</style>