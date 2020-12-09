<template>
   <div class="register-container">
		<!-- Preloader -->
		<div class="auth-preloader register-container__auth-preloader">
			<div class="auth-preloader__preloader"
				:class="classPreloader"
			></div>
		</div>

		<!-- Error from server -->
		<transition name="register-error">
			<div class="register-error"
				v-if="GET_IS_ERROR && !GET_IS_MODAL"
			>
				<p class="register-error__msg">
					{{ GET_ERROR }}
				</p>
			</div>
		</transition>

		<!-- Register form -->
      <form class="register-form"
         novalidate
         @submit.prevent="registerUser"
      >
         <!-- Email -->
         <div class="register-form__box-field">
            <label for="register-form-email" class="register-form__label"
               :class="{ 'register-form__label--active': isActiveClass.email }"
               
            >
               Почта
            </label>
            <input class="register-form__input"
               :class="[
                  { 'register-form__input--active': isActiveClass.email },
                  { 'register-form__input--error': isRegisterSubmit && $v.email.$error },
               ]"
               type="email"
               autocomplete="off"
               id="register-form-email"
               v-model.trim="email"
               @focus="focusInput('email')"
               @blur="blurInput('email')"
            >
            <span class="register-form__msg-error" 
               v-if="isRegisterSubmit && !$v.email.required"
            >Введите почту!</span>
            <span class="register-form__msg-error" 
               v-if="isRegisterSubmit && !$v.email.email"
            >Не верно указана почта!</span>
         </div>

         <!-- Password -->
         <div class="register-form__box-field">
            <label for="register-form-password" class="register-form__label"
               :class="{ 'register-form__label--active': isActiveClass.password }"
            >
               Пароль
            </label>
            <input class="register-form__input"
               :class="[
                  { 'register-form__input--active': isActiveClass.password },
                  { 'register-form__input--error': isRegisterSubmit && $v.password.$error },
               ]"
               type="password"
               autocomplete="off"
               id="register-form-password"
               v-model.trim="password"
               @focus="focusInput('password')"
               @blur="blurInput('password')"
            >
            <span class="register-form__msg-error"
               v-if="isRegisterSubmit && !$v.password.required"
            >Введите пароль!</span>
            <span class="register-form__msg-error"
               v-if="isRegisterSubmit && !$v.password.minLength"
            >
               Пароль должен состоять минимум из {{ $v.password.$params.minLength.min }} символов!
            </span>
         </div>

         <!-- Confirm password -->
         <div class="register-form__box-field">
            <label for="register-form-confirm-password" class="register-form__label"
               :class="{ 'register-form__label--active': isActiveClass.confirmPassword }"
            >
               Подтвердить пароль
            </label>
            <input class="register-form__input"
               :class="[
                  { 'register-form__input--active': isActiveClass.confirmPassword },
                  { 'register-form__input--error': isRegisterSubmit && $v.confirmPassword.$error },
               ]"
               type="password"
               autocomplete="off"
               id="register-form-confirm-password"
               v-model.trim="confirmPassword"
               @focus="focusInput('confirmPassword')"
               @blur="blurInput('confirmPassword')"
            >
            <span class="register-form__msg-error"
               v-if="isRegisterSubmit && !$v.confirmPassword.required"
            >Подтвердите пароль!</span>
            <span class="register-form__msg-error"
               v-else-if="isRegisterSubmit && !$v.confirmPassword.sameAsPassword"
            >Пароли должны быть идентичными!</span>
         </div>

         <!-- Submit -->
         <div class="register-form__box-submit">
            <button class="register-form__submit">Зарегистрироваться</button>
         </div>
			
      </form>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
   name: 'vRegister',
   data: () => ({
      email: '',
      password: '',
      confirmPassword: '',
      isRegisterSubmit: false,
      isActiveClass: {
         email: false,
         password: false,
         confirmPassword: false,
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
      confirmPassword: {
         required,
         sameAsPassword: sameAs('password')
      }
	},
	computed: mapGetters([
		'GET_IS_MODAL',
		'GET_IS_ERROR',
		'GET_ERROR',
		'GET_CLASS_OF_PRELOADER'
	]),
   methods: {
		...mapActions([
			'REGISTER_USER'
		]),
      focusInput(type) {
         this.isActiveClass[type] = true;
      },
      blurInput(type) {
         if (!this[type]) {
            this.isActiveClass[type] = false;
         }
      },
      registerUser() {
         this.isRegisterSubmit = true;
         this.$v.$touch();
         if (this.$v.$invalid) return;

			this.REGISTER_USER({
				email: this.email,
				password: this.password
			})
			.then(({ success }) => {
				if (!success) return;
				this.$router.push({ name: 'Shop' });
			})
      }
	},
	watch: {
		GET_CLASS_OF_PRELOADER(val) {
			this.classPreloader = val;
		}
	}
}
</script>

<style lang="scss">
   .register-container {
      height: 100%;
      display: flex;
		flex-direction: column;
      justify-content: center;
      align-items: center;
		position: relative;
		backface-visibility: hidden;

		&__auth-preloader {
			width: 100%;
			height: .3rem;
			position: absolute;
			top: 0;
			left: 0;
		}
   }
	.auth-preloader {
		&__preloader {
			width: 0;
			height: 100%;
			background: #007bff;

			&--start-loading {
				animation: start-loading .3s ease forwards;
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
	.register-error {
		position: absolute;
		top: 6rem;

		&__msg {
			font-size: 2rem;
			font-weight: 500;
			color: tomato;
		}
	}
	.register-error-enter-active {
		animation: register-error-enter .2s;
	}
	@keyframes register-error-enter {
		0% { transform: translateX(-3rem); }
		25% { transform: translateX(2rem); }
		50% { transform: translateX(-1rem); }
		100% { transform: translateX(0rem); }
	}
	.register-error-leave-active {
		animation: register-error-leave .2s;
	}
	@keyframes register-error-leave {
		0% { transform: translateY(1rem); }
		100% { transform: translateY(-4rem); opacity: 0; }
	}

   .register-form {
      width: 40rem;
      padding: 5rem 7rem;
      background: #1d2325;
      border-radius: 2rem;

		@media (max-width: 375px) {
			width: 90%;
			padding: 3rem;
		}

      &__box-field {
         margin-bottom: 4.5rem;
         position: relative;
      }
      &__label {
         font-size: 2rem;
         color: #bbb;
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
         background: #1d2325;
         border: none;
         border-bottom: .2rem solid #bbb;
         caret-color: #fff;
         padding: 1rem 0 .2rem .2rem;
         color: #fff;
         transition: .2s;

         &--active {
            border-bottom: .2rem solid #fff;
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
         width: 100%;
         font-size: 2rem;
         padding: 1rem 0;
         border-radius: 1rem;
         border: none;
         background: #007bff;
         transition: .2s;
         color: #fff;

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
   }
</style>